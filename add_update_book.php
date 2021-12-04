<?php
    include 'Book.php';
    include 'Author.php';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $caption = $_POST['caption']; 
        $genre = $_POST['genre']; 
        $insertedOn = $_POST['insertedOn'];
        $publishedOn = $_POST['publishedOn']; 
        $authorId= $_POST["authorId"];
        $deletedOn = null;
        $id = $_POST['editable-id']; 

        $conn = new mysqli('localhost', 'root', '', 'library');


        if($conn->connect_error)
        {
            die("connection failed:" + $conn->connect_error );
        }
    

        $author = new Author($authorId, null, null, null,null, null, $conn);
       
        $book = new Book(NULL, $caption, $genre, $author, $publishedOn, $insertedOn, $deletedOn, $conn );
      
        if($id === ""|| $id===0){ 
            //ako je prazan nije kliknut editovanje i upisujemo ga jer ga nemamo u bazi
            
            $book->insert();
           
            echo json_encode($book->_BookId);
        }
        else{
            //ako jeste popunjen onda update-ujemo postojeci na osnovu dobijenog id-a
            $book->updateById($id);
            echo $id;
        }
    }
?>