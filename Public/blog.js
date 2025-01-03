    const menuBar = document.getElementById('menuBar')
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav a');
    const logo = document.querySelector('.logo h1')

    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) { 
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
    });
    
    let Main_Menu = document.querySelector('.Main_Menu')
    menuBar.addEventListener('click', () => {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 50) { 
              Main_Menu.classList.add('scrolled');
          } else {
              Main_Menu.classList.remove('scrolled');
          }
      });
      Main_Menu.classList.toggle('show');
    })
    // Api Data
    const yearCreated = document.querySelector('.yearCreated')
    const yearFooter = `
        <p class="pFooter">Copyright © ${new Date().getFullYear()}. All Rights Reserved.</p>
    `
    yearCreated.innerHTML = yearFooter;


    let blog_box = document.getElementById('blog_box')
    let blog_boxs = document.getElementById('blog_boxs')
    
    const url = './Blog.json';
    fetch(url)
    .then(res => res.json())
    .then(data => {
        data.forEach(getData => {
            let {image, title, content} = getData;
            let img = document.createElement('img')
            let h2Elem = document.createElement('h2')
            let pElem = document.createElement('p')
            
            img.src = image;
            h2Elem.innerHTML = title;
            pElem.innerHTML = content;
            
            const allBox = document.createElement('article')
            let imageBox = document.createElement('span');
            let contentBox = document.createElement('main');
            let profileBox = document.createElement('section');
            
            imageBox.appendChild(img);
            contentBox.append(h2Elem, pElem)

            let postTime = new Date();
            const usFormattedDate = postTime.toLocaleDateString('en-US'); // Display the formatted date
            profileBox.innerText = usFormattedDate
            allBox.append( imageBox, contentBox, profileBox)
            blog_boxs.appendChild(allBox)
        })
    })
    .catch(error => {
        console.log(error)
    })


    // Fetch posts and display them
let fetchPosts = () => {
  fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
      // const postsDiv = document.getElementById('posts');
      // postsDiv.innerHTML = '';
      blog_box.innerHTML = '';
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
          <article class="">
              <span>
                <img src="${post.image}" alt="Blog image">
              </span>
              <main>
                <h2>${post.headline}</h2>
                <p>${post.content}</p>
              </main>
              <section>
                <p><i>Author:</i> ${post.author}</p>
                <small>${new Date().toLocaleDateString()}</small>
                <button onclick="deletePost('${post.id}')">Delete</button>
              </section> 
          </article>
        `;
        // postsDiv.appendChild(postElement);
        blog_boxs.appendChild(postElement);
      });
    });
}

// Delete a post
let deletePost = (postId) => {
  console.log('Deleting post with ID:', postId);  // Log the postId for debugging

  if (!postId) {
    console.error('No post ID provided!');
    return;
  }

  if (confirm('Are you sure you want to delete this post?')) {
    fetch(`/api/posts://${postId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error); });
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      fetchPosts();  // Refresh the posts after deletion
    })
    .catch(error => console.error('Error deleting post:', error.message));
  }
}

// Create a new post
document.getElementById('new-post-form').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('image', document.getElementById('image').files[0]);
  formData.append('headline', document.getElementById('headline').value);
  formData.append('author', document.getElementById('author').value);
  formData.append('content', document.getElementById('content').value);

  fetch('/api/posts', {
    method: 'POST',
    body: formData
  }).then(response => response.json())
    .then(() => {
      fetchPosts();  // Refresh the posts after adding a new one
      document.getElementById('new-post-form').reset();
    });
});

// Fetch posts on page load
fetchPosts();




// function createPost(postData) {
//   const token = localStorage.getItem('jwtToken');  // Get the stored token

//   fetch('/api/posts', {
//       method: 'POST',
//       headers: {
//           'Authorization': `Bearer ${token}`,  // Include the JWT token
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(postData)  // Your blog post data
//   })
//   .then(response => {
//       if (response.status === 403) {
//           return response.json().then(data => {
//               if (data.error === "Company not registered" && data.redirectUrl) {
//                   alert("You are not registered. Redirecting to the registration page...");
//                   window.location.href = data.redirectUrl;  // Redirect to the registration page
//               }
//           });
//       } else if (!response.ok) {
//           throw new Error('Something went wrong');
//       }
//       return response.json();
//   })
//   .then(data => {
//       console.log('Post created successfully:', data);
//       // Refresh or update the UI with the new post
//   })
//   .catch(error => console.error('Error creating post:', error));
// }

// // Example of calling the function
// createPost({
//   headline: 'New Blog Post',
//   content: 'This is the content of the blog post',
//   image: 'image_url.jpg'
//   author: 'image_url.jpg'
// });
