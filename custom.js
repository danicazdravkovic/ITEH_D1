$ = jQuery;

(function ($) {
  $(function () {
    $('#input_publ_cont').datetimepicker({
      "allowInputToggle": true,
      "showClose": true,
      "showClear": true,
      "showTodayButton": true,
      "format": "MM/DD/YYYY HH:mm:ss",
    });

    $('#input_add_cont').datetimepicker({
      "allowInputToggle": true,
      "showClose": true,
      "showClear": true,
      "showTodayButton": true,
      "format": "MM/DD/YYYY HH:mm:ss",
    });
  });

})(jQuery);
function deleteBook(id) {
  //PRVA PRIMENA AJAXA
  $.get('delete_book.php?id="' + id + '"')
    .then(function (res) {
      console.log(res);
    })
    .fail(function (err) {
      console.log(err);
    });
  var btn = document.getElementById(id);
  var row = btn.parentNode.parentNode.parentNode;

  row.parentNode.removeChild(row);
}
function deleteAuthor(id) {
  $.get('delete_author.php?id="' + id + '"')
    .then(function (res) {
      console.log(res);
    })
    .fail(function (err) {
      console.log(err);
    });
  var btn = document.getElementById(id);
  var row = btn.parentNode.parentNode.parentNode;

  row.parentNode.removeChild(row);
}

$(document).ready(function () {
  //document.ready proverava da li su ucitani svi elementi iz projekta
  $('.btn-close').click(function () {
    $('#add-form')[0].reset();
  });


  $('#add-form').submit(function (e) {
    e.preventDefault();
    let isNew = $(".editable-id").val() === "";
    let form = e.target;
    let formData = new FormData(form);
    let data = $(this).serializeArray();
    console.log(data);
    //DRUGA PRIMENA AJAXA
    $.ajax({
      url: form.action,
      data: data,
      method: form.method,
      success: function (response) {
        var id = response.replace('\r', '').replace('\n', '');
        let tbody = $('#table-cont'); //uzima telo tabele sa stranica index.php i authors.php
        let str = '';
        let index = 0;

        var allvalues = formData.values(); //uzima sve vrednosti iz forme
        console.log(allvalues);
        for (var value of formData.values()) { //prolazimo kroz vrednosti unetih na formi
          if (index !== 5) //preskacemo editable id, to nam ne treba za proveru, jer to response vraca, ne mozemo mi da izvucemo iz forme
          {
            if ($("#select-author").length > 0 && index === 2) { //condition for exams.php build full name from td
              let authorName = $("#select-author > option[value='" + value + "']").text();
              str += "<td data-author_id='" + value + "'><span>" + authorName + "</span></td>";
            }
            else if ($("#select-author").length > 0 && (index == 3 || index == 4)) {
              str += "<td><span>" + value.substr(0, 10) + "</span></td>";
            }
            else if ($("#select-author").length == 0 && index == 2) {
              str += "<td><span>" + value.substr(0, 10) + "</span></td>";
            }
            else {
              str += "<td><span>" + value + "</span></td>"; //ne treba da obradjujemo vrednost, već je uneta u text formatu
            }
            index++;
          }
        }
        var isBook = $("#select-author").length > 0;
        var btnclass = isBook ? 'delete-book' : ''; //ako smo na stranici book(index), onda dodaj klasu delete book, inace nista
        str += '<td><span><button type="button" data-toggle="modal" data-target="#add_edit_Modal" data-id="' + id + '" id="' + id + '" class="btn btn-info edit-book btn-edit editable">Edit</button>  <button id="' + id + '" class="btn btn-danger btn-delete ' + btnclass + '">Delete</button><span></td>';
        //dodajemo jedan td koji sadrzi dugmad (za edit i za delete)
        if (!isNew) {  //ako knjiga/autor nisu novi
          let selectorID = ".tr-";
          selectorID = selectorID.concat(id)
          tbody.find(selectorID).remove(); //brisem taj stari sto vec imam, i kasnije nalepim novi red
        }

        tbody.append("<tr class='tr-" + id + "'>" + str + "</tr>");
        //dodajemo nove azurirane podatke

        //resetovanje polja u formi
        $('.editable-id').val('');
        $('.form-group input').each(function (i, elem) {
          $(elem).val('');
        });


        $('#add_edit_Modal').modal('toggle'); //ako je otvoren modal, zatvori ga, ako je zatvoren otovri ga
      },
      error: function (err) {
        console.log(err);
      }
    });
    return false;
  });

  var isChecked = false;
  $(document).on('click', '.editable', function (e) {
 
    //ovo je kad se klikne na edit dugme, u bilo kom redu
    let id = $(this).data('id'); //uzima vrednost id ja tog objekta
    $('.editable-id').val(id); //popunjava input hidden sa tim id-jem, da bi znao za kog autora/knjigu izvlaci vrednosti 
    $(this).closest('tr').find('td > span').each(function (i, elem) { //nadji red kome edit dugme pripada
      let value = $(elem).html().replace(/\s{2,}/g, '').trim(); //fromatiranje vrednosti
      console.log(value);
      if ($("#select-author").length == 0) //da znam da li posmatram book ili autors stranicu, ne postoji selekt element
      {
        //for authors.php
        if (i === 0)
          $("#firstname").val(value); //popunjavam vrednost forme ovim vrednostima koje procitam iz reda, koji sam ucitala u 163 liniji koda
        else if (i === 1)
          $("#lastname").val(value);
        else if (i === 2)
          $("#insertedOn").val(value);


      } else {
        //for index.php - books

        if (i === 0)
          $("#caption").val(value);
        else if (i === 1)
          $("#genre").val(value);
        else if (i === 3)
          $("#publishedOn").val(value);
        else if (i === 4)
          $("#insertedOn").val(value);

      }
    });


  });
  $(document).on('click', '.btn-delete', function (e) {

    if ($(this).hasClass('delete-book'))
      deleteBook($(this).attr('id'));
    else deleteAuthor($(this).attr('id'));
  });

});




