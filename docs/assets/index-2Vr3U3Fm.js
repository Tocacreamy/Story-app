var U=o=>{throw TypeError(o)};var M=(o,e,t)=>e.has(o)||U("Cannot "+t);var c=(o,e,t)=>(M(o,e,"read from private field"),t?t.call(o):e.get(o)),p=(o,e,t)=>e.has(o)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),L=(o,e,t,s)=>(M(o,e,"write to private field"),s?s.call(o,t):e.set(o,t),t),b=(o,e,t)=>(M(o,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class j{constructor(){this.app=document.getElementById("app")||document.body}getTemplate(){return`
      <section class="container">
        <h1>Beranda</h1>
        <div id="auth-status"></div>
        <div id="stories-container" class="stories-grid">
          <p class="loading-text">Loading stories...</p>
        </div>
      </section>
    `}showLoginMessage(){const e=document.getElementById("auth-status");e.innerHTML=`
      <div class="auth-message">
        <p>Please log in to view stories</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `,document.getElementById("stories-container").innerHTML=""}showAuthenticatedUser(e){const t=document.getElementById("auth-status");t.innerHTML=`
      <div class="auth-message success">
        <p>Welcome back, ${e}!</p>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    `}displayStories(e){const t=document.getElementById("stories-container");if(e.length===0){t.innerHTML="<p>No stories found</p>";return}t.innerHTML=e.map(s=>{const i=new Date(s.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
            <div class="story-card" style="view-transition-name: story-card-${s.id}">
              <img src="${s.photoUrl||"/images/placeholder.png"}" 
                   alt="Story image uploaded by ${s.name||"Anonymous"}" 
                   class="story-image"
                   onerror="this.onerror=null; this.src='/images/placeholder.png'; this.classList.add('placeholder-image');"
                   style="view-transition-name: story-image-${s.id}">
              <div class="story-content">
                <div class="story-header">
                  <h1 class="story-name" style="view-transition-name: story-title-${s.id}">${s.name}</h1>
                  <span class="story-date">${i}</span>
                </div>
                <p class="story-desc">${s.description}</p>
                <a href="#/detail/${s.id}" class="read-more" aria-label="Read more about ${s.name}'s story">Read More</a>
              </div>
            </div>
          `}).join("")}showErrorMessage(e){const t=document.getElementById("stories-container");t.innerHTML=`<p class="error-message">Error: ${e}</p>`}bindLogoutButton(e){const t=document.getElementById("logout-btn");t&&t.addEventListener("click",e)}navigateToLogin(){window.location.hash="#/login"}}const l={BASE_URL:"https://story-api.dicoding.dev/v1"},k={LOGIN:`${l.BASE_URL}/login`,REGISTER:`${l.BASE_URL}/register`,GETALLSTORIES:`${l.BASE_URL}/stories`,ADDNEWSTORY:`${l.BASE_URL}/stories`,DETAILSTORY:`${l.BASE_URL}/stories`,ADDNEWSTORYGUESS:`${l.BASE_URL}/stories/guest`},G=async()=>{try{const o=localStorage.getItem("token");if(!o)throw new Error("You must be logged in to view stories");const e=await fetch(k.GETALLSTORIES,{headers:{Authorization:`Bearer ${o}`}}),t=await e.json();if(!e.ok)throw new Error(t.message||"Failed to fetch stories");return t.listStory||[]}catch(o){throw console.error("Error fetching stories:",o),o}},V=async(o,e,t=null,s=null)=>{try{const i=localStorage.getItem("token");if(!i)throw new Error("You must be logged in to add a story");const r=new FormData;r.append("description",o),r.append("photo",e),t!==null&&s!==null&&(r.append("lat",t),r.append("lon",s));const a=await fetch(k.ADDNEWSTORY,{method:"POST",headers:{Authorization:`Bearer ${i}`},body:r}),n=await a.json();if(!a.ok)throw new Error(n.message||"Failed to add story");return n}catch(i){throw console.error("Error adding new story:",i),i}},Y=async o=>{try{const e=localStorage.getItem("token");if(!e)throw new Error("You must be logged in to see story details");const t=await fetch(`${k.DETAILSTORY}/${o}`,{method:"GET",headers:{Authorization:`Bearer ${e}`}}),s=await t.json();if(!t.ok)throw new Error(s.message||"Failed to fetch story details");return s}catch(e){throw new Error("Error detail Story: ",e)}};class W{async getStories(){try{return await G()}catch(e){throw new Error(`Failed to fetch stories: ${e.message}`)}}isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}logout(){localStorage.removeItem("token"),localStorage.removeItem("userId"),localStorage.removeItem("name")}}const J="story-app-db",K=1,g="stories";function T(){return new Promise((o,e)=>{console.log("Opening database");const t=indexedDB.open(J,K);t.onerror=()=>e(t.error),t.onsuccess=()=>o(t.result),t.onupgradeneeded=()=>{const s=t.result;s.objectStoreNames.contains(g)||s.createObjectStore(g,{keyPath:"id"})}})}async function Z(o){console.log("Saving stories to database");const t=(await T()).transaction(g,"readwrite"),s=t.objectStore(g);return o.forEach(i=>s.put(i)),t.complete||t.done||t}async function C(){console.log("Getting cached stories from database");const t=(await T()).transaction(g,"readonly").objectStore(g);return new Promise((s,i)=>{const r=t.getAll();r.onsuccess=()=>s(r.result),r.onerror=()=>i(r.error)})}async function Q(o){console.log("Deleting story from database by ID:",o);const t=(await T()).transaction(g,"readwrite");return t.objectStore(g).delete(o),t.complete||t.done||t}class X{constructor(e,t){this.view=e,this.model=t}async init(){if(this.model.isUserLoggedIn()){const e=this.model.getUserName();this.view.showAuthenticatedUser(e),this.view.bindLogoutButton(()=>{this.model.logout(),this.view.navigateToLogin()}),await this._refreshStories()}else this.view.showLoginMessage()}async _refreshStories(){if(navigator.onLine)try{const e=await this.model.getStories();this.view.displayStories(e),await Z(e),console.log("Stories saved to IndexedDB")}catch(e){console.warn("Failed to fetch stories from network, attempting to load from cache:",e);const t=await C();t&&t.length>0?(this.view.displayStories(t),this.view.showErrorMessage("Error: Failed to fetch stories from network. Showing cached stories.")):this.view.showErrorMessage("Error: Failed to fetch stories and no cached stories available: "+e.message)}else{const e=await C();e&&e.length>0?(this.view.displayStories(e),this.view.showErrorMessage("You are offline. Go to Saved Stories to view them.")):this.view.showErrorMessage("You are offline. Stories cannot be loaded right now.")}}}class ee{constructor(){this.view=new j,this.model=new W,this.presenter=new X(this.view,this.model)}async render(){return this.view.getTemplate()}async afterRender(){await this.presenter.init()}}class te{getTemplate(){return`
      <section class="container register-container">
        <h1>Create an Account</h1>
        <div class="register-card">
          <form id="register-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-container">
                <input type="password" id="password" name="password" placeholder="Create a password" required minlength="8">
                <button type="button" id="toggle-password" class="toggle-password" aria-label="Show password">
                  <img src="/images/visible.svg" alt="show password icon">
                </button>
              </div>
              <small class="password-requirements">Minimum 8 characters with uppercase, lowercase, and numbers</small>
            </div>
            
            <div class="form-group">
              <button type="submit" id="register-button" class="register-button">Register</button>
            </div>
            
            <div id="message" class="message" role="alert" aria-live="assertive"></div>
          </form>
          
          <div class="login-link">
            <p>Already have an account? <a href="#/login">Login here</a></p>
          </div>
        </div>
      </section>
    `}getName(){return document.getElementById("name").value.trim()}getEmail(){return document.getElementById("email").value.trim()}getPassword(){return document.getElementById("password").value}showLoading(){const e=document.getElementById("register-button");e.disabled=!0,e.textContent="Creating account...",e.setAttribute("aria-busy","true")}hideLoading(){const e=document.getElementById("register-button");e.disabled=!1,e.textContent="Register",e.removeAttribute("aria-busy")}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupPasswordToggle(){const e=document.getElementById("toggle-password"),t=document.getElementById("password");e.addEventListener("click",()=>{t.type==="password"?(t.type="text",e.innerHTML='<img src="/images/visible_off.svg" alt="hide password icon">',e.setAttribute("aria-label","Hide password")):(t.type="password",e.innerHTML='<img src="/images/visible.svg" alt="show password icon">',e.setAttribute("aria-label","Show password"))})}bindRegisterSubmit(e){document.getElementById("register-form").addEventListener("submit",s=>{s.preventDefault(),e()})}}class se{constructor(e,t,s){this.view=e,this.userModel=t,this.router=s,this.init()}init(){this.view.setupPasswordToggle(),this.view.bindRegisterSubmit(this.handleRegisterSubmit.bind(this))}async handleRegisterSubmit(){const e=this.view.getName(),t=this.view.getEmail(),s=this.view.getPassword();if(!e.trim()){this.view.showMessage("Name is required","error");return}if(!t.trim()){this.view.showMessage("Email is required","error");return}if(!s){this.view.showMessage("Password is required","error");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){this.view.showMessage("Please enter a valid email address","error");return}if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(s)){this.view.showMessage("Password must be at least 8 characters and include uppercase, lowercase, and numbers","error");return}try{this.view.showLoading(),await this.userModel.register(e,t,s),this.view.showMessage("Registration successful! Redirecting to login...","success"),setTimeout(()=>{this.router.navigateTo("/login")},1500)}catch(a){this.view.showMessage(a.message||"Registration failed. Please try again.","error")}finally{this.view.hideLoading()}}}class A{constructor(){this.baseUrl=l.BASE_URL,this.endpoints={LOGIN:`${this.baseUrl}/login`,REGISTER:`${this.baseUrl}/register`},this.storageKey="user_session"}async login(e,t){try{const s=await fetch(this.endpoints.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),i=await s.json();if(!s.ok)throw new Error(i.message||"Login failed");if(i.loginResult&&i.loginResult.token)return this.setUserSession(i.loginResult.token,{userId:i.loginResult.userId,name:i.loginResult.name}),i.loginResult;throw new Error("Invalid response format")}catch(s){throw s}}async register(e,t,s){try{const i=await fetch(this.endpoints.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:s})}),r=await i.json();if(!i.ok)throw new Error(r.message||"Registration failed");return r}catch(i){throw i}}isLoggedIn(){return!!this.getToken()}getToken(){return localStorage.getItem("token")}getUserName(){const e=localStorage.getItem(this.storageKey);if(e)try{return JSON.parse(e).name}catch(t){return console.error("Error parsing user data:",t),null}return null}setUserSession(e,t){localStorage.setItem("token",e),localStorage.setItem(this.storageKey,JSON.stringify(t))}clearUserSession(){localStorage.removeItem("token"),localStorage.removeItem(this.storageKey)}logout(){this.clearUserSession()}}class ie{constructor(){this.view=new te,this.model=new A,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new se(this.view,this.model,{navigateTo:e=>{window.location.hash=e}})}}class oe{getTemplate(){return`
      <section class="container login-container">
        <h1>Login to Your Account</h1>
        <main id="main-content" tabindex="-1">
          <div class="login-card">
            <form id="login-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <div class="password-input-container">
                  <input type="password" id="password" name="password" placeholder="Enter your password" required>
                  <button type="button" id="toggle-password" class="toggle-password" aria-label="Show password">
                    <img src="images/visible.svg" alt="show password icon">
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <button type="submit" class="login-button">Login</button>
              </div>
              
              <div id="message" class="message" role="alert" aria-live="assertive"></div>
            </form>
            
            <div class="register-link">
              <p>Don't have an account? <a href="#/register">Register here</a></p>
            </div>
          </div>
        </main>
      </section>
    `}getEmail(){return document.getElementById("email").value.trim()}getPassword(){return document.getElementById("password").value}showLoading(){const e=document.querySelector(".login-button");e.disabled=!0,e.textContent="Logging in..."}hideLoading(){const e=document.querySelector(".login-button");e.disabled=!1,e.textContent="Login"}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupPasswordToggle(){const e=document.getElementById("toggle-password"),t=document.getElementById("password");e.addEventListener("click",()=>{t.type==="password"?(t.type="text",e.innerHTML='<img src="images/visible_off.svg" alt="hide password icon">',e.setAttribute("aria-label","Hide password")):(t.type="password",e.innerHTML='<img src="images/visible.svg" alt="show password icon">',e.setAttribute("aria-label","Show password"))})}bindLoginSubmit(e){document.getElementById("login-form").addEventListener("submit",s=>{s.preventDefault(),e()})}}class re{constructor(e,t,s){this.view=e,this.userModel=t,this.router=s,this.init()}init(){this.view.setupPasswordToggle(),this.view.bindLoginSubmit(this.handleLoginSubmit.bind(this))}async handleLoginSubmit(){const e=this.view.getEmail(),t=this.view.getPassword();if(!e||!t){this.view.showMessage("Please fill in all fields","error");return}try{this.view.showLoading(),await this.userModel.login(e,t),this.view.showMessage("Login successful!","success"),setTimeout(()=>{this.router.navigateTo("/")},1500)}catch(s){this.view.showMessage(s.message||"Login failed","error")}finally{this.view.hideLoading()}}}class ae{constructor(){this.view=new oe,this.model=new A,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new re(this.view,this.model,{navigateTo:e=>{window.location.hash=e}})}}class ne{getTemplate(){return`
      <section class="container">
        <h1>Upload Story</h1>
        <div id="auth-status"></div>
        <div id="upload-container" class="form-container">
          <form id="upload-form" aria-labelledby="upload-form-title">
            <h2 id="upload-form-title" class="visually-hidden">Story Upload Form</h2>
            
            <div class="form-group">
              <label for="description">Story Description</label>
              <textarea id="description" name="description" rows="5" placeholder="Write your story here..." required></textarea>
            </div>
            
            <div class="form-group">
              <label for="photo">Photo</label>
              <div class="file-input-container">
                <input type="file" id="photo" name="photo" accept="image/*" required aria-describedby="photo-requirements">
                <button type="button" id="camera-button" class="camera-button" aria-controls="camera-container">Open Camera</button>
                <p id="photo-requirements" class="visually-hidden">Please select an image file or capture a photo with the camera</p>
              </div>
              <div class="camera-container" id="camera-container" style="display: none;" aria-live="polite">
                <video id="camera-preview" autoplay playsinline aria-label="Camera preview"></video>
                <div class="camera-controls">
                  <button type="button" id="capture-button" class="capture-button">Capture Photo</button>
                  <button type="button" id="close-camera" class="close-camera">Close Camera</button>
                </div>
              </div>
              <div class="file-preview-container">
                <img id="image-preview" src="#" alt="Preview of uploaded image" style="display: none;">
              </div>
            </div>
            
            <div class="form-group">
              <fieldset>
                <legend>Location</legend>
                <div class="location-input-container">
                  <div class="location-buttons">
                    <button type="button" id="get-location" class="location-button" aria-describedby="location-help">Get My Location</button>
                    <button type="button" id="reset-location" class="location-button reset-location" aria-controls="location-status">Reset Location</button>
                  </div>
                  <p id="location-help" class="visually-hidden">This will use your device's geolocation to determine your current coordinates</p>
                  <div id="location-status" class="location-status" aria-live="polite">No location selected</div>
                  <div id="map-section" class="map-section">
                    <div id="location-map" class="location-map" aria-label="Map to select location"></div>
                  </div>
                  <input type="hidden" id="latitude" name="latitude">
                  <input type="hidden" id="longitude" name="longitude">
                </div>
              </fieldset>
            </div>
            
            <div class="form-group">
              <button type="submit" class="upload-button">Upload Story</button>
            </div>
            
            <div id="message" class="message" role="alert" aria-live="assertive"></div>
          </form>
        </div>
      </section>
    `}showLoginMessage(){const e=document.getElementById("auth-status");e.innerHTML=`
      <div class="auth-message">
        <p>You must be logged in to upload stories</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `,document.getElementById("upload-container").style.display="none"}showAuthenticatedUser(e){const t=document.getElementById("auth-status");t.innerHTML=`
      <div class="auth-message success">
        <p>Welcome, ${e||"User"}! Share your story below.</p>
      </div>
    `}getDescription(){return document.getElementById("description").value.trim()}getPhotoFile(){return document.getElementById("photo").files[0]}getLocationCoordinates(){const e=document.getElementById("latitude").value||null,t=document.getElementById("longitude").value||null;return{lat:e,lng:t}}setLocationCoordinates(e,t){document.getElementById("latitude").value=e,document.getElementById("longitude").value=t}clearLocationCoordinates(){document.getElementById("latitude").value="",document.getElementById("longitude").value=""}updatePhotoInput(e){const t=document.getElementById("photo"),s=new DataTransfer;s.items.add(e),t.files=s.files}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupFilePreview(){const e=document.getElementById("photo"),t=document.getElementById("image-preview");e.addEventListener("change",s=>{const i=s.target.files[0];if(i){const r=new FileReader;r.onload=a=>{t.src=a.target.result,t.style.display="block",this.showMessage(`Image ${i.name} selected`,"info")},r.readAsDataURL(i)}else t.style.display="none"})}updateLocationStatus(e,t,s=!0){const i=document.getElementById("location-status");s&&e&&t?(i.textContent=`Location set: ${Number(e).toFixed(6)}, ${Number(t).toFixed(6)}`,i.classList.add("location-set")):(i.textContent="No location selected",i.classList.remove("location-set"))}disableForm(e=!0){const t=document.getElementById("upload-form"),s=t.querySelector('button[type="submit"]'),i=t.querySelectorAll("input, textarea, button");s.disabled=e,i.forEach(r=>r.disabled=e),e?(s.setAttribute("aria-busy","true"),s.textContent="Uploading..."):(s.removeAttribute("aria-busy"),s.textContent="Upload Story")}resetForm(){const e=document.getElementById("upload-form"),t=document.getElementById("image-preview");e.reset(),t.style.display="none",this.updateLocationStatus(null,null,!1)}bindCameraButton(e){document.getElementById("camera-button").addEventListener("click",e)}bindCloseCamera(e){document.getElementById("close-camera").addEventListener("click",e)}bindCaptureButton(e){document.getElementById("capture-button").addEventListener("click",e)}bindGetLocationButton(e){document.getElementById("get-location").addEventListener("click",e)}bindResetLocationButton(e){document.getElementById("reset-location").addEventListener("click",e)}bindFormSubmit(e){document.getElementById("upload-form").addEventListener("submit",s=>{s.preventDefault(),e()})}updateImagePreview(e){const t=document.getElementById("image-preview");t.src=e,t.style.display="block",this.showMessage("Photo captured successfully","success")}navigateToHome(){setTimeout(()=>{window.location.hash="#/"},2e3)}}class ce{isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}async uploadStory(e,t,s=null,i=null){try{if(!this.isUserLoggedIn())throw new Error("You must be logged in to upload stories");return{success:!0,data:await V(e,t,s,i)}}catch(r){return{success:!1,error:r.message||"Failed to upload story"}}}validateStoryData(e,t){const s=[];return e||s.push("Please enter a story description"),t||s.push("Please select an image or take a photo"),{isValid:s.length===0,errors:s}}}class le{static async createFileFromBlob(e,t){return new File([e],t,{type:e.type})}static updateFileInput(e,t){const s=new DataTransfer;s.items.add(t),e.files=s.files}static validateImageFile(e){return["image/jpeg","image/jpg","image/png","image/gif"].includes(e.type)?e.size>5242880?{isValid:!1,error:"File size must be less than 5MB"}:{isValid:!0}:{isValid:!1,error:"Please select a valid image file (JPEG, PNG, or GIF)"}}}class de{constructor(e,t,s,i){this.view=e,this.model=t,this.mapHandler=s,this.cameraHandler=i,this.isInitialized=!1,this.eventListeners=[]}async init(){if(!this.model.isUserLoggedIn())return this.view.showLoginMessage(),!1;const e=this.model.getUserName();return this.view.showAuthenticatedUser(e),this.view.setupFilePreview(),this.bindEventHandlers(),await this.initializeMap(),this.setupCleanup(),this.isInitialized=!0,!0}setupCleanup(){const e=this.cleanup.bind(this),t=this.cleanup.bind(this),s=()=>{document.hidden&&this.cleanup()};window.addEventListener("beforeunload",e),window.addEventListener("hashchange",t),document.addEventListener("visibilitychange",s),this.eventListeners=[{element:window,event:"beforeunload",handler:e},{element:window,event:"hashchange",handler:t},{element:document,event:"visibilitychange",handler:s}]}cleanup(){this.cameraHandler&&this.isInitialized&&this.cameraHandler.closeCamera(),this.eventListeners.forEach(({element:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),this.eventListeners=[],this.isInitialized=!1}bindEventHandlers(){this.view.bindCameraButton(this.handleOpenCamera.bind(this)),this.view.bindCloseCamera(this.handleCloseCamera.bind(this)),this.view.bindCaptureButton(this.handleCapturePhoto.bind(this)),this.view.bindGetLocationButton(this.handleGetLocation.bind(this)),this.view.bindResetLocationButton(this.handleResetLocation.bind(this)),this.view.bindFormSubmit(this.handleFormSubmit.bind(this))}async initializeMap(){try{const e=await this.mapHandler.init("location-map");return e.success?(this.mapHandler.map.on("click",t=>{const{lat:s,lng:i}=t.latlng;this.view.setLocationCoordinates(s,i),this.view.updateLocationStatus(s,i),this.view.showMessage("Location selected from map","info")}),!0):(this.view.showMessage(`Error initializing map: ${e.error}`,"error"),!1)}catch(e){return this.view.showMessage(`Failed to load map: ${e.message}`,"error"),console.error("Map initialization error:",e),!1}}async handleOpenCamera(){const e=await this.cameraHandler.openCamera();e.success?this.view.showMessage("Camera activated. Click 'Capture Photo' when ready.","info"):this.view.showMessage(e.error,"error")}handleCloseCamera(){this.cameraHandler.closeCamera(),this.view.showMessage("Camera closed","info")}async handleCapturePhoto(){const e=this.cameraHandler.capturePhoto();if(e.success){this.view.updateImagePreview(e.imageDataUrl);const t=await le.createFileFromBlob(e.blob,"camera-photo.jpg");this.view.updatePhotoInput(t),this.cameraHandler.closeCamera()}}async handleGetLocation(){this.view.showMessage("Getting your location...","info");const e=await this.mapHandler.getUserLocation();e.success?(this.view.setLocationCoordinates(e.latitude,e.longitude),this.view.updateLocationStatus(e.latitude,e.longitude),this.view.showMessage("Location detected successfully!","success")):this.view.showMessage(e.error,"error")}handleResetLocation(){this.mapHandler.clearMarker(),this.mapHandler.resetView(),this.view.clearLocationCoordinates(),this.view.updateLocationStatus(null,null,!1),this.view.showMessage("Location has been reset","info")}async handleFormSubmit(){const e=this.view.getDescription(),t=this.view.getPhotoFile(),{lat:s,lng:i}=this.view.getLocationCoordinates(),r=this.model.validateStoryData(e,t);if(!r.isValid){this.view.showMessage(r.errors[0],"error");return}try{this.view.disableForm(!0),this.view.showMessage("Uploading your story...","info");const a=await this.model.uploadStory(e,t,s,i);if(a.success)this.view.showMessage("Your story has been uploaded successfully!","success"),this.view.resetForm(),this.mapHandler&&this.mapHandler.clearMarker(),this.cleanup(),this.view.navigateToHome();else throw new Error(a.error)}catch(a){this.view.showMessage(a.message||"Failed to upload story","error"),console.error("Upload error:",a)}finally{this.view.disableForm(!1)}}}var S,H,D;class ue{constructor(){p(this,S);this.stream=null,this.videoElement=null,this.containerElement=null,this.isActive=!1,this.errorCallbacks=[]}onError(e){this.errorCallbacks.push(e)}init(e,t){this.videoElement=e,this.containerElement=t}async openCamera(){try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Camera access is not supported in this browser");return this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}}),this.videoElement.srcObject=this.stream,this.containerElement.style.display="block",this.isActive=!0,{success:!0}}catch(e){return b(this,S,H).call(this,e,"openCamera"),{success:!1,error:b(this,S,D).call(this,e)}}}closeCamera(){this.stream&&(this.stream.getTracks().forEach(e=>{e.stop(),console.log("Camera track stopped:",e.kind)}),this.stream=null),this.videoElement&&(this.videoElement.srcObject=null),this.containerElement&&(this.containerElement.style.display="none"),this.isActive=!1}isActiveCamera(){return this.isActive&&this.stream&&this.stream.active}capturePhoto(){if(!this.stream||!this.isActive)return{success:!1};const e=document.createElement("canvas"),t=e.getContext("2d");e.width=this.videoElement.videoWidth,e.height=this.videoElement.videoHeight,t.drawImage(this.videoElement,0,0,e.width,e.height);const s=e.toDataURL("image/jpeg"),i=this._dataURLtoBlob(s);return{success:!0,imageDataUrl:s,blob:i}}_dataURLtoBlob(e){const t=e.split(";base64,"),s=t[0].split(":")[1],i=window.atob(t[1]),r=i.length,a=new Uint8Array(r);for(let n=0;n<r;++n)a[n]=i.charCodeAt(n);return new Blob([a],{type:s})}}S=new WeakSet,H=function(e,t="camera"){console.error(`Camera error in ${t}:`,e),this.errorCallbacks.forEach(s=>s(e,t))},D=function(e){switch(e.name){case"NotAllowedError":return"Camera access was denied. Please allow camera access in your browser settings.";case"NotFoundError":return"No camera found on this device.";case"NotSupportedError":return"Camera is not supported in this browser.";case"NotReadableError":return"Camera is already in use by another application.";default:return`Could not access camera: ${e.message}`}};const he="modulepreload",me=function(o){return"/Story-app/"+o},R={},ge=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),n=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=Promise.allSettled(t.map(h=>{if(h=me(h),h in R)return;R[h]=!0;const B=h.endsWith(".css"),z=B?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${z}`))return;const m=document.createElement("link");if(m.rel=B?"stylesheet":he,B||(m.as="script"),m.crossOrigin="",m.href=h,n&&m.setAttribute("nonce",n),document.head.appendChild(m),B)return new Promise((_,q)=>{m.addEventListener("load",_),m.addEventListener("error",()=>q(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=a,window.dispatchEvent(n),!n.defaultPrevented)throw a}return i.then(a=>{for(const n of a||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};class ${constructor(){this.map=null,this.marker=null,this.leaflet=null}async init(e,t={}){const i={...{center:[-6.2088,106.8456],zoom:13},...t};await this._loadLeafletCSS();try{return this.leaflet=await ge(()=>import("./leaflet-src-r9KgTLRM.js").then(r=>r.l),[]),this.map=this.leaflet.map(e),this.leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),this.map.setView(i.center,i.zoom),this.map.on("click",r=>{this.setMarker(r.latlng.lat,r.latlng.lng)}),{success:!0,map:this.map}}catch(r){return console.error("Error initializing map:",r),{success:!1,error:`Could not initialize map: ${r.message}`}}}setMarker(e,t,s=!0){if(!this.map||!this.leaflet)return;this.marker&&this.map.removeLayer(this.marker);const i=this.leaflet.divIcon({className:"custom-marker",html:'<div class="custom-marker-pin"></div>',iconSize:[30,30],iconAnchor:[15,30]});this.marker=this.leaflet.marker([e,t],{icon:i}).addTo(this.map).bindTooltip("Selected Location",{className:"marker-tooltip"}),s&&this.map.setView([e,t],this.map.getZoom())}async getUserLocation(){return new Promise(e=>{if(!navigator.geolocation){e({success:!1,error:"Geolocation is not supported by your browser"});return}navigator.geolocation.getCurrentPosition(t=>{const{latitude:s,longitude:i}=t.coords;this.map&&(this.setMarker(s,i,!0),this.map.setZoom(15)),e({success:!0,latitude:s,longitude:i})},t=>{e({success:!1,error:`Could not get your location: ${t.message}`})})})}getMarkerPosition(){if(!this.marker)return null;const e=this.marker.getLatLng();return{latitude:e.lat,longitude:e.lng}}clearMarker(){this.marker&&this.map&&(this.map.removeLayer(this.marker),this.marker=null)}resetView(e=[-6.2088,106.8456],t=13){this.map&&this.map.setView(e,t)}_loadLeafletCSS(){return new Promise(e=>{if(document.querySelector('link[href*="leaflet.css"]')){e();return}const t=document.createElement("link");t.rel="stylesheet",t.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",t.integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",t.crossOrigin="",t.onload=e,document.head.appendChild(t)})}}class pe{constructor(){this.view=new ne,this.model=new ce,this.mapHandler=new $,this.cameraHandler=new ue,this.presenter=null,console.log("UploadStoryPage initialized")}async render(){return this.view.getTemplate()}async afterRender(){const e=document.getElementById("camera-preview"),t=document.getElementById("camera-container");e&&t&&this.cameraHandler.init(e,t),this.presenter=new de(this.view,this.model,this.mapHandler,this.cameraHandler),await this.presenter.init()}cleanup(){this.presenter&&this.presenter.cleanup()}}function x(o){const e=o.split("/");return{resource:e[1]||null,id:e[2]||null}}function we(o){let e="";return o.resource&&(e=e.concat(`/${o.resource}`)),o.id&&(e=e.concat("/:id")),e||"/"}function F(){return location.hash.replace("#","")||"/"}function fe(){const o=F(),e=x(o);return we(e)}function ve(){const o=F();return x(o)}function ye(o,e="en-US",t={}){return new Date(o).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric",...t})}function I(o,e,t){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){const s=e[e.length-1];return Object.keys(s).forEach(i=>{i!=="offset"&&i!=="easing"&&i!=="composite"&&(o.style[i]=s[i])}),null}return o.animate(e,t)}class be{getTemplate(){return`
      <section class="container">
        <a href="#/" class="back-button">← Back to Stories</a>
        <h1>Story Details</h1>
        <div id="auth-status"></div>
        <main id="main-content" tabindex="-1">
          <div id="story-container" class="detail-story-container">
            <p class="loading-text">Loading story details...</p>
          </div>
        </main>
      </section>
    `}showLoginMessage(){const e=document.getElementById("auth-status");e.innerHTML=`
      <div class="auth-message">
        <p>You must be logged in to view story details</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `,document.getElementById("story-container").innerHTML=""}showAuthenticatedUser(e){const t=document.getElementById("auth-status");t.innerHTML=`
      <div class="auth-message success">
        <p>Welcome, ${e}!</p>
      </div>
    `}showLoading(){const e=document.getElementById("story-container");e.innerHTML="<p class='loading-text'>Loading story details...</p>"}showError(e){const t=document.getElementById("story-container");t.innerHTML=`<p class="error-message">Error: ${e}</p>`}displayStory(e,t,s=!1){const i=document.getElementById("story-container");let r=`
      <div class="detail-story">
        <div class="detail-story-header">
          <h2 style="view-transition-name: story-title-${e.id}">${e.name}</h2>
          <p class="story-date" aria-label="Story created on ${t}">${t}</p>
        </div>
        
        <div class="detail-story-image">
          <img src="${e.photoUrl}" 
               alt="${e.name}'s story" 
               class="story-photo" 
               style="view-transition-name: story-image-${e.id}">
        </div>
        
        <div class="detail-story-content">
          <h3 class="visually-hidden">Story Description</h3>
          <p class="story-description">${e.description}</p>
        </div>
    `;s&&(r+=`
        <div class="detail-story-location">
          <h3>Location</h3>
          <div id="story-map" class="story-map" aria-label="Map showing story location"></div>
        </div>
      `),r+="</div>",i.innerHTML=r}animateStoryElements(){const e=document.querySelector(".detail-story-header"),t=document.querySelector(".detail-story-image"),s=document.querySelector(".detail-story-content"),i=document.querySelector(".detail-story-location");e&&I(e,[{opacity:0,transform:"translateY(-20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards"}),t&&I(t,[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:800,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:200}),s&&I(s,[{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:400}),i&&I(i,[{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:600})}animateMapContainer(){const e=document.getElementById("story-map");e&&I(e,[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:800,easing:"ease-out",fill:"forwards"})}}class Ee{async getStoryDetail(e){try{return(await Y(e)).story}catch(t){throw new Error(`Failed to fetch story details: ${t.message}`)}}isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}}class Se{constructor(e,t,s){this.view=e,this.model=t,this.mapHandler=s}async init(e){if(!this.model.isUserLoggedIn()){this.view.showLoginMessage();return}const t=this.model.getUserName();if(this.view.showAuthenticatedUser(t),!e){this.view.showError("Story ID not found in URL");return}try{this.view.showLoading();const s=await this.model.getStoryDetail(e);if(!s){this.view.showError("Story not found");return}const i=ye(s.createdAt),r=!!(s.lat&&s.lon);this.view.displayStory(s,i,r),this.view.animateStoryElements(),r&&await this.initializeMap(s)}catch(s){this.view.showError(s.message),console.error("Error loading story:",s)}}async initializeMap(e){try{(await this.mapHandler.init("story-map",{center:[e.lat,e.lon],zoom:15})).success&&(this.mapHandler.setMarker(e.lat,e.lon),this.view.animateMapContainer())}catch(t){console.error("Error initializing map:",t)}}}class Le{constructor(){this.view=new be,this.model=new Ee,this.mapHandler=new $,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new Se(this.view,this.model,this.mapHandler);const{id:e}=ve();await this.presenter.init(e)}}class Ie{getTemplate(){return`
      <section class="container">
        <h1>Notification Settings</h1>
        <div id="auth-status"></div>
        <div class="notification-settings">
          <div class="setting-card">
            <h2>Push Notifications</h2>
            <p>Get notified when your stories are successfully uploaded and other important updates.</p>
            
            <div id="notification-status" class="notification-status">
              <p class="loading-text">Checking notification status...</p>
            </div>
            
            <div id="notification-controls" class="notification-controls">
              <button id="enable-notifications" class="btn btn-primary" style="display: none;">
                Enable Notifications
              </button>
              <button id="disable-notifications" class="btn" style="display: none;">
                Disable Notifications
              </button>
            </div>
            
            <div id="notification-message" class="message" role="alert" aria-live="assertive"></div>
          </div>
        </div>
      </section>
    `}showAuthenticatedUser(e){const t=document.getElementById("auth-status");t.innerHTML=`
      <div class="auth-message success">
        <p>Welcome, ${e}! Manage your notification preferences below.</p>
      </div>
    `}showLoginMessage(){const e=document.getElementById("auth-status");e.innerHTML=`
      <div class="auth-message">
        <p>You must be logged in to manage notification settings</p>
        <a href="#/login" class="login-btn">Login</a>
      </div>
    `}updateNotificationStatus(e,t=!0){const s=document.getElementById("notification-status"),i=document.getElementById("enable-notifications"),r=document.getElementById("disable-notifications");if(!t){s.innerHTML=`
        <div class="status-indicator error">
          <span class="status-icon">❌</span>
          <span>Push notifications are not supported in this browser</span>
        </div>
      `,i.style.display="none",r.style.display="none";return}e?(s.innerHTML=`
        <div class="status-indicator success">
          <span class="status-icon">✅</span>
          <span>Push notifications are enabled</span>
        </div>
      `,i.style.display="none",r.style.display="inline-block"):(s.innerHTML=`
        <div class="status-indicator">
          <span class="status-icon">🔕</span>
          <span>Push notifications are disabled</span>
        </div>
      `,i.style.display="inline-block",r.style.display="none")}showMessage(e,t="info"){const s=document.getElementById("notification-message");s.textContent=e,s.className="message",s.classList.add(t)}setLoading(e){const t=document.getElementById("enable-notifications"),s=document.getElementById("disable-notifications");e?(t.disabled=!0,s.disabled=!0,t.textContent="Processing...",s.textContent="Processing..."):(t.disabled=!1,s.disabled=!1,t.textContent="Enable Notifications",s.textContent="Disable Notifications")}bindEnableNotifications(e){document.getElementById("enable-notifications").addEventListener("click",e)}bindDisableNotifications(e){document.getElementById("disable-notifications").addEventListener("click",e)}}class Be{isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){const e=localStorage.getItem("user_session");if(e)try{return JSON.parse(e).name}catch(t){return console.error("Error parsing user data:",t),"User"}return"User"}getNotificationPermission(){return"Notification"in window?Notification.permission:"default"}isNotificationSupported(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window}}class Me{constructor(e,t,s){this.view=e,this.model=t,this.pushManager=s}async init(){if(!this.model.isUserLoggedIn())return this.view.showLoginMessage(),!1;const e=this.model.getUserName();return this.view.showAuthenticatedUser(e),this.bindEventHandlers(),await this.checkNotificationStatus(),!0}bindEventHandlers(){this.view.bindEnableNotifications(this.handleEnableNotifications.bind(this)),this.view.bindDisableNotifications(this.handleDisableNotifications.bind(this))}async checkNotificationStatus(){try{if(!this.model.isNotificationSupported()){this.view.updateNotificationStatus(!1,!1);return}const t=await this.pushManager.getSubscriptionStatus();this.view.updateNotificationStatus(t.isSubscribed,!0)}catch(e){console.error("Error checking notification status:",e),this.view.showMessage("Error checking notification status","error")}}async handleEnableNotifications(){try{this.view.setLoading(!0),this.view.showMessage("Setting up notifications...","info");const e=await this.pushManager.requestPermission();if(!e.success)throw new Error(e.error);const t=await this.pushManager.subscribe();if(!t.success)throw new Error(t.error);this.view.updateNotificationStatus(!0,!0),this.view.showMessage("Notifications enabled successfully!","success")}catch(e){console.error("Error enabling notifications:",e),this.view.showMessage(e.message||"Failed to enable notifications","error")}finally{this.view.setLoading(!1)}}async handleDisableNotifications(){try{this.view.setLoading(!0),this.view.showMessage("Disabling notifications...","info");const e=await this.pushManager.unsubscribe();if(!e.success)throw new Error(e.error);this.view.updateNotificationStatus(!1,!0),this.view.showMessage("Notifications disabled successfully","success")}catch(e){console.error("Error disabling notifications:",e),this.view.showMessage(e.message||"Failed to disable notifications","error")}finally{this.view.setLoading(!1)}}}class Ce{constructor(){this.view=new Ie,this.model=new Be,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){const e=window.pushManager;if(!e){console.error("Push manager not initialized");return}this.presenter=new Me(this.view,this.model,e),await this.presenter.init()}cleanup(){this.presenter&&typeof this.presenter.cleanup=="function"&&this.presenter.cleanup()}}class Pe{constructor(){this.app=document.getElementById("app")||document.body}getTemplate(){return`
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="saved-stories-container" class="stories-grid">
          <p class="loading-text">Loading saved stories...</p>
        </div>
      </section>
    `}displayStories(e){const t=document.getElementById("saved-stories-container");if(e.length===0){t.innerHTML="<p>No saved stories found.</p>";return}t.innerHTML=e.map(s=>{const i=new Date(s.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
            <div class="story-card" style="view-transition-name: story-card-${s.id}">
              <img src="${s.photoUrl||"/images/placeholder.png"}" 
                   alt="Story image uploaded by ${s.name||"Anonymous"}" 
                   class="story-image"
                   onerror="this.onerror=null; this.src='/images/placeholder.png'; this.classList.add('placeholder-image');"
                   style="view-transition-name: story-image-${s.id}">
              <div class="story-content">
                <div class="story-header">
                  <h1 class="story-name" style="view-transition-name: story-title-${s.id}">${s.name}</h1>
                  <span class="story-date">${i}</span>
                </div>
                <p class="story-desc">${s.description}</p>
                <div class="story-actions">
                  <a href="#/detail/${s.id}" class="read-more" aria-label="Read more about ${s.name}'s story">Read More</a>
                  <button class="delete-story-btn" data-id="${s.id}" aria-label="Delete ${s.name}'s story">Delete</button>
                </div>
              </div>
            </div>
          `}).join("")}showErrorMessage(e){const t=document.getElementById("saved-stories-container");t.innerHTML=`<p class="error-message">Error: ${e}</p>`}}class ke{constructor(e){this.view=e}async init(){await this._loadSavedStories(),this._setupStoryDeletion()}async _loadSavedStories(){try{const e=await C();this.view.displayStories(e)}catch(e){console.error("Error loading saved stories:",e),this.view.showErrorMessage("Error loading saved stories: "+e.message)}}_setupStoryDeletion(){const e=document.getElementById("saved-stories-container");e&&e.addEventListener("click",async t=>{if(t.target.classList.contains("delete-story-btn")){const s=t.target.dataset.id;if(confirm("Are you sure you want to delete this saved story?"))try{await Q(s),console.log(`Saved story with ID ${s} deleted.`),await this._loadSavedStories()}catch(i){console.error("Error deleting saved story:",i),this.view.showErrorMessage("Error: Failed to delete saved story: "+i.message)}}})}}class Te{async render(){return`
      <div class="content">
        <div id="saved-stories-content"></div>
      </div>
    `}async afterRender(){const e=new Pe,t=document.getElementById("saved-stories-content");t&&(t.innerHTML=e.getTemplate()),await new ke(e).init()}}class Ne{getTemplate(){return`
      <section class="container text-center py-5">
        <h1 class="not-found-heading">404 - Not Found</h1>
        <p class="not-found-message">The page you are looking for does not exist.</p>
        <a href="#/" class="btn btn-primary mt-3">Go to Homepage</a>
      </section>
    `}}class Ue{async render(){return new Ne().getTemplate()}async afterRender(){}}const Re={"/":new ee,"/uploadStory":new pe,"/login":new ae,"/register":new ie,"/detail/:id":new Le,"/notifications":new Ce,"/saved-stories":new Te};var d,f,u,v,y,O,P;class Ae{constructor({navigationDrawer:e,drawerButton:t,content:s}){p(this,y);p(this,d,null);p(this,f,null);p(this,u,null);p(this,v,null);L(this,d,s),L(this,f,t),L(this,u,e),b(this,y,O).call(this)}async renderPage(){const e=fe(),t=Re[e]||new Ue;c(this,v)&&typeof c(this,v).cleanup=="function"&&c(this,v).cleanup(),document.startViewTransition&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches?await document.startViewTransition(async()=>{c(this,d).innerHTML=await t.render(),await t.afterRender(),c(this,d).focus(),b(this,y,P).call(this)}).finished:(c(this,d).innerHTML=await t.render(),await t.afterRender(),c(this,d).focus(),b(this,y,P).call(this)),L(this,v,t)}}d=new WeakMap,f=new WeakMap,u=new WeakMap,v=new WeakMap,y=new WeakSet,O=function(){c(this,f).addEventListener("click",()=>{const e=c(this,u).classList.toggle("open");c(this,f).setAttribute("aria-expanded",e?"true":"false")}),document.body.addEventListener("click",e=>{!c(this,u).contains(e.target)&&!c(this,f).contains(e.target)&&c(this,u).classList.remove("open"),c(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&c(this,u).classList.remove("open")})})},P=function(){const e=c(this,d).querySelector("h1");if(e){const t=document.createElement("div");t.setAttribute("aria-live","assertive"),t.classList.add("visually-hidden"),t.textContent=`Navigated to ${e.textContent}`,document.body.appendChild(t),setTimeout(()=>{document.body.removeChild(t)},1e3)}};class He{constructor(){this.vapidPublicKey="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",this.subscription=null,this.isSupported=this.checkSupport(),this.eventListeners=[]}checkSupport(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window}async init(){if(!this.isSupported)return console.warn("Push notifications are not supported in this browser"),{success:!1,error:"Not supported"};try{const e=await navigator.serviceWorker.register("/sw.js");return console.log("Service Worker registered:",e),await navigator.serviceWorker.ready,{success:!0,registration:e}}catch(e){return console.error("Service Worker registration failed:",e),{success:!1,error:e.message}}}async requestPermission(){if(!this.isSupported)return{success:!1,error:"Not supported"};try{const e=await Notification.requestPermission();return e==="granted"?{success:!0,permission:e}:{success:!1,error:"Permission denied"}}catch(e){return console.error("Error requesting notification permission:",e),{success:!1,error:e.message}}}async subscribe(){try{const e=await navigator.serviceWorker.ready,t=await e.pushManager.getSubscription();if(t)return this.subscription=t,{success:!0,subscription:t};const s=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(this.vapidPublicKey)});return this.subscription=s,await this.sendSubscriptionToServer(s),{success:!0,subscription:s}}catch(e){return console.error("Error subscribing to push notifications:",e),{success:!1,error:e.message}}}async unsubscribe(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(await t.unsubscribe(),await this.removeSubscriptionFromServer(t),this.subscription=null,{success:!0}):{success:!0,message:"No active subscription"}}catch(e){return console.error("Error unsubscribing from push notifications:",e),{success:!1,error:e.message}}}async sendSubscriptionToServer(e){const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const s={endpoint:e.endpoint,keys:{p256dh:this.arrayBufferToBase64(e.getKey("p256dh")),auth:this.arrayBufferToBase64(e.getKey("auth"))}},i=await fetch(`${l.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(s)}),r=await i.json();if(!i.ok)throw new Error(r.message||"Failed to subscribe to notifications");return r}async removeSubscriptionFromServer(e){const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const s=await fetch(`${l.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:e.endpoint})}),i=await s.json();if(!s.ok)throw new Error(i.message||"Failed to unsubscribe from notifications");return i}async getSubscriptionStatus(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return{isSubscribed:!!t,subscription:t}}catch(e){return console.error("Error getting subscription status:",e),{isSubscribed:!1,subscription:null}}}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),s=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(s),r=new Uint8Array(i.length);for(let a=0;a<i.length;++a)r[a]=i.charCodeAt(a);return r}arrayBufferToBase64(e){const t=new Uint8Array(e);let s="";for(let i=0;i<t.byteLength;i++)s+=String.fromCharCode(t[i]);return window.btoa(s)}cleanup(){this.eventListeners.forEach(({element:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),this.eventListeners=[]}}let w=null;const E=document.getElementById("install-button"),De=()=>{console.log("setupInstallPrompt function called."),window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),w=o,console.log("beforeinstallprompt fired, deferredPrompt set:",w),E&&(E.style.display="block")}),E&&E.addEventListener("click",async()=>{if(console.log("Install button clicked. deferredPrompt value:",w),E&&(E.style.display="none"),w){w.prompt();const{outcome:o}=await w.userChoice;console.log(`User response to the install prompt: ${o}`),w=null}else console.warn("deferredPrompt is null, cannot show install prompt.")})};function N(){const o=document.getElementById("offline-indicator");navigator.onLine?(o.style.display="none",document.body.classList.remove("has-offline-indicator")):(o.style.display="block",document.body.classList.add("has-offline-indicator"))}window.addEventListener("online",N);window.addEventListener("offline",N);document.addEventListener("DOMContentLoaded",async()=>{N(),De();const o=new Ae({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")}),e=new He;window.pushManager=e;const t=await e.init();t.success?console.log("Push notifications initialized successfully"):console.warn("Push notifications initialization failed:",t.error),await o.renderPage(),window.addEventListener("hashchange",async()=>{await o.renderPage()});const s=document.querySelector("#main-content"),i=document.querySelector(".skip-link");i&&s&&i.addEventListener("click",function(r){r.preventDefault(),i.blur(),s.focus(),s.scrollIntoView({behavior:"smooth",block:"start"});const a=document.createElement("div");a.setAttribute("aria-live","assertive"),a.className="visually-hidden",a.textContent="Skipped to main content",document.body.appendChild(a),setTimeout(()=>{document.body.removeChild(a)},1e3)})});
