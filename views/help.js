function deleteTask(index) {
    tasks.splice(index, 1);
       fetch('/delete-task', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
           body: JSON.stringify({ index: index })
         })
             .then(response => response.json())
             .then(data => {
           // Handle success response
           console.log(data);
         })
             .catch(error => {
           // Handle error response
           console.error(error);
         });
   };
