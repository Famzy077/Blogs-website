    const menuBar = document.getElementById('menuBar')
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav a');
    const logo = document.querySelector('.logo h1')

    window.addEventListener('load', (e) => {
      
    })
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
            let profileBox = document.createElement('small');
            
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
  
// Fetch and display posts
const fetchPosts = () => {
  fetch('https://blogs-server-khaki.vercel.app/api/posts')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(posts => {
      blog_box.innerHTML = '';
      posts.forEach(getPost => {
        const postElement = document.createElement('div');
        const dateString = new Date(getPost.date).toLocaleDateString('en-US'); 
        postElement.innerHTML = `
          <article class='article'>
            <span>
              <img class='jsImg' src="https://blogs-server-khaki.vercel.app/${getPost.image}" alt="${getPost.title}">
            </span>
            <div>
              <h2>${getPost.headline}</h2>
              <p>${getPost.content}</p>
              <p class='author'><i>Author:</i> ${getPost.author}</p>
            </div>
            <section class='section_js'>
              <small>${dateString}</small>
              <button class="delete-btn" data-id="${getPost._id}">Delete</button>
            </section> 
          </article>
        `;
        blog_box.appendChild(postElement);
        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', 
            deletePost);
        });
      });
    })
    .catch(error => console.error('Error fetching posts:', error));
};

// Delete a post
const Delete = document.getElementById('delete')
const deleteAlert = document.createElement('p')
function deletePost(e) {
  const postId = e.target.getAttribute('data-id');

  // Confirm deletion before making the request
  const confirmDeletePost = confirm('Are you sure you want to delete this post?');
  if (!confirmDeletePost) {
    return; // Exit if the user cancels the deletion
  }

  fetch(`https://blogs-server-khaki.vercel.app/api/posts/${postId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      return response.json();
    })
    .then(data => {
      // Display success message
      const deleteAlert = document.createElement('div');
      deleteAlert.innerHTML = `
        <b class='btnELem'>Post deleted successfully <button deleteId='${data}' class="delete-btn">X</button></b>
      `;
      Delete.append(deleteAlert);

      const btnAlert = deleteAlert.querySelector('.delete-btn');
      if (btnAlert) {
        btnAlert.addEventListener('click', (e) => {
          e.preventDefault();
          deleteAlert.remove(); // Remove the alert when the button is clicked
        });
      } else {
        console.error('Button not found');
      }

      console.log('Post deleted successfully:', data.message);
      fetchPosts(); // Refresh the post list
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.'); // Notify the user of the error
    });
}

// // Create a new post
// document.getElementById('new-post-form').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const formData = new FormData();
//   formData.append('image', document.getElementById('image').files[0]);
//   formData.append('headline', document.getElementById('headline').value);
//   formData.append('author', document.getElementById('author').value);
//   formData.append('content', document.getElementById('content').value);

//   fetch('https://blogs-server-khaki.vercel.app/api/posts', { method: 'POST', body: formData })
//     .then(response => response.json())
//     .then(() => {
//       fetchPosts();
//       document.getElementById('new-post-form').reset();
//     })
//     .catch(error => console.error('Error creating post:', error));
// });


document.getElementById('new-post-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const image = document.getElementById('image').files[0];
  const headline = document.getElementById('headline').value;
  const author = document.getElementById('author').value;
  const content = document.getElementById('content').value;

  if (!image || !headline || !author || !content) {
    return alert('All fields are required');
  }

  const formData = new FormData();
  formData.append('image', image);
  formData.append('headline', headline);
  formData.append('author', author);
  formData.append('content', content);

  fetch('https://blogs-server-khaki.vercel.app/api/posts', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error('Error: ' + text);
        });
      }
      return response.json();
    })
    .then(() => {
      fetchPosts();
      document.getElementById('new-post-form').reset();
    })
    .catch(error => console.error('Error creating post:', error));
});

// Fetch posts on page load
fetchPosts();