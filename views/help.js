function deleteTask(){
let element = document.getElementById('delete-task-btn');
element.addEventListener('click', () => {
	fetch('/tasks/delete', {
		method: 'PATCH',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: id })
	  })
	  .then(response => response.json())
	  .then(data => {
		if (response.ok) {
			res.status(200).json(message = 'Task deleted successfully');
		  } else {
			res.status(500).json(message =  'Internal server error' );
		  }
		console.log(data);
	  })
	  .catch(error => {
		// Handle error response
		console.error(error);
	  });
})
}