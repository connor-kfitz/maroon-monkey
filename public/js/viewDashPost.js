// var parent = document.getElementById('postContainer');

// parent.addEventListener('click', event => {
//     if (event.target.className == 'post') {
//         displaySelectedPost(event.target.id);
//         console.log(event.target.id);
//     }
// })

// const displaySelectedPost = async (ID) => {

//   const response = await fetch('/dashboard/post/' + ID, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });

//     if (response.ok) {
//     document.location.replace('/dashboard/post/' + ID);
//     } else {
//     alert('TEST Error');
//     }
// }
