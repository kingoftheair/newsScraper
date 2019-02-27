$(document).ready(function() {
    // opens materialize modal
    $(".modal").modal();
    // sends the user's comment to the server to put in the db.
    $(".save-comment").click(function(event) {
      let thisId = $(this).attr("data-id");
      let comment = $(`#modal${thisId} #userComment`).val();
      console.log(comment, thisId);
      $(`#modal${thisId} #userComment`).val("");
  
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          body: comment
        }
      }).then(function(data) {
        console.log(data);
        location.reload();
      });
    });
  
    // sends comment info to the db to be deleted
    $(".delete-comment").click(function(event) {
      let thisId = $(this).attr("data-id");
      let articleId = $(this).attr("data-article");
      console.log(thisId);
      console.log(articleId);
  
      $.ajax({
        method: "GET",
        url: "/comments/" + thisId + "/" + articleId
      }).then(function(data) {
        console.log(data);
        location.reload();
      });
    });
  });