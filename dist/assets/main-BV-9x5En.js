var M=o=>{throw TypeError(o)};var L=(o,e,t)=>e.has(o)||M("Cannot "+t);var c=(o,e,t)=>(L(o,e,"read from private field"),t?t.call(o):e.get(o)),g=(o,e,t)=>e.has(o)?M("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),b=(o,e,t,s)=>(L(o,e,"write to private field"),s?s.call(o,t):e.set(o,t),t),v=(o,e,t)=>(L(o,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();class x{constructor(){this.app=document.getElementById("app")||document.body}getTemplate(){return`
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
              <img src="${s.photoUrl}" 
                   alt="Story image uploaded by ${s.name}" 
                   class="story-image"
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
          `}).join("")}showErrorMessage(e){const t=document.getElementById("stories-container");t.innerHTML=`<p class="error-message">Error: ${e}</p>`}bindLogoutButton(e){const t=document.getElementById("logout-btn");t&&t.addEventListener("click",e)}navigateToLogin(){window.location.hash="#/login"}}const l={BASE_URL:"https://story-api.dicoding.dev/v1"},I={LOGIN:`${l.BASE_URL}/login`,REGISTER:`${l.BASE_URL}/register`,GETALLSTORIES:`${l.BASE_URL}/stories`,ADDNEWSTORY:`${l.BASE_URL}/stories`,DETAILSTORY:`${l.BASE_URL}/stories`,ADDNEWSTORYGUESS:`${l.BASE_URL}/stories/guest`},O=async()=>{try{const o=localStorage.getItem("token");if(!o)throw new Error("You must be logged in to view stories");const e=await fetch(I.GETALLSTORIES,{headers:{Authorization:`Bearer ${o}`}}),t=await e.json();if(!e.ok)throw new Error(t.message||"Failed to fetch stories");return t.listStory||[]}catch(o){throw console.error("Error fetching stories:",o),o}},z=async(o,e,t=null,s=null)=>{try{const i=localStorage.getItem("token");if(!i)throw new Error("You must be logged in to add a story");const a=new FormData;a.append("description",o),a.append("photo",e),t!==null&&s!==null&&(a.append("lat",t),a.append("lon",s));const r=await fetch(I.ADDNEWSTORY,{method:"POST",headers:{Authorization:`Bearer ${i}`},body:a}),n=await r.json();if(!r.ok)throw new Error(n.message||"Failed to add story");return n}catch(i){throw console.error("Error adding new story:",i),i}},q=async o=>{try{const e=localStorage.getItem("token");if(!e)throw new Error("You must be logged in to see story details");const t=await fetch(`${I.DETAILSTORY}/${o}`,{method:"GET",headers:{Authorization:`Bearer ${e}`}}),s=await t.json();if(!t.ok)throw new Error(s.message||"Failed to fetch story details");return s}catch(e){throw new Error("Error detail Story: ",e)}};class _{async getStories(){try{return await O()}catch(e){throw new Error(`Failed to fetch stories: ${e.message}`)}}isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}logout(){localStorage.removeItem("token"),localStorage.removeItem("userId"),localStorage.removeItem("name")}}class G{constructor(e,t){this.view=e,this.model=t}async init(){if(this.model.isUserLoggedIn()){const e=this.model.getUserName();this.view.showAuthenticatedUser(e),this.view.bindLogoutButton(()=>{this.model.logout(),this.view.navigateToLogin()});try{const t=await this.model.getStories();this.view.displayStories(t)}catch(t){this.view.showErrorMessage(t.message)}}else this.view.showLoginMessage()}}class V{constructor(){this.view=new x,this.model=new _,this.presenter=new G(this.view,this.model)}async render(){return this.view.getTemplate()}async afterRender(){await this.presenter.init()}}class Y{getTemplate(){return`
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
                  <img src="public/images/visible.svg" alt="show password icon">
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
    `}getName(){return document.getElementById("name").value.trim()}getEmail(){return document.getElementById("email").value.trim()}getPassword(){return document.getElementById("password").value}showLoading(){const e=document.getElementById("register-button");e.disabled=!0,e.textContent="Creating account...",e.setAttribute("aria-busy","true")}hideLoading(){const e=document.getElementById("register-button");e.disabled=!1,e.textContent="Register",e.removeAttribute("aria-busy")}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupPasswordToggle(){const e=document.getElementById("toggle-password"),t=document.getElementById("password");e.addEventListener("click",()=>{t.type==="password"?(t.type="text",e.innerHTML='<img src="public/images/visible_off.svg" alt="hide password icon">',e.setAttribute("aria-label","Hide password")):(t.type="password",e.innerHTML='<img src="public/images/visible.svg" alt="show password icon">',e.setAttribute("aria-label","Show password"))})}bindRegisterSubmit(e){document.getElementById("register-form").addEventListener("submit",s=>{s.preventDefault(),e()})}}class j{constructor(e,t,s){this.view=e,this.userModel=t,this.router=s,this.init()}init(){this.view.setupPasswordToggle(),this.view.bindRegisterSubmit(this.handleRegisterSubmit.bind(this))}async handleRegisterSubmit(){const e=this.view.getName(),t=this.view.getEmail(),s=this.view.getPassword();if(!e.trim()){this.view.showMessage("Name is required","error");return}if(!t.trim()){this.view.showMessage("Email is required","error");return}if(!s){this.view.showMessage("Password is required","error");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){this.view.showMessage("Please enter a valid email address","error");return}if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(s)){this.view.showMessage("Password must be at least 8 characters and include uppercase, lowercase, and numbers","error");return}try{this.view.showLoading(),await this.userModel.register(e,t,s),this.view.showMessage("Registration successful! Redirecting to login...","success"),setTimeout(()=>{this.router.navigateTo("/login")},1500)}catch(r){this.view.showMessage(r.message||"Registration failed. Please try again.","error")}finally{this.view.hideLoading()}}}class P{constructor(){this.baseUrl=l.BASE_URL,this.endpoints={LOGIN:`${this.baseUrl}/login`,REGISTER:`${this.baseUrl}/register`},this.storageKey="user_session"}async login(e,t){try{const s=await fetch(this.endpoints.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),i=await s.json();if(!s.ok)throw new Error(i.message||"Login failed");if(i.loginResult&&i.loginResult.token)return this.setUserSession(i.loginResult.token,{userId:i.loginResult.userId,name:i.loginResult.name}),i.loginResult;throw new Error("Invalid response format")}catch(s){throw s}}async register(e,t,s){try{const i=await fetch(this.endpoints.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:s})}),a=await i.json();if(!i.ok)throw new Error(a.message||"Registration failed");return a}catch(i){throw i}}isLoggedIn(){return!!this.getToken()}getToken(){return localStorage.getItem("token")}getUserName(){const e=localStorage.getItem(this.storageKey);if(e)try{return JSON.parse(e).name}catch(t){return console.error("Error parsing user data:",t),null}return null}setUserSession(e,t){localStorage.setItem("token",e),localStorage.setItem(this.storageKey,JSON.stringify(t))}clearUserSession(){localStorage.removeItem("token"),localStorage.removeItem(this.storageKey)}logout(){this.clearUserSession()}}class W{constructor(){this.view=new Y,this.model=new P,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new j(this.view,this.model,{navigateTo:e=>{window.location.hash=e}})}}class J{getTemplate(){return`
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
                    <img src="public/images/visible.svg" alt="show password icon">
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
    `}getEmail(){return document.getElementById("email").value.trim()}getPassword(){return document.getElementById("password").value}showLoading(){const e=document.querySelector(".login-button");e.disabled=!0,e.textContent="Logging in..."}hideLoading(){const e=document.querySelector(".login-button");e.disabled=!1,e.textContent="Login"}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupPasswordToggle(){const e=document.getElementById("toggle-password"),t=document.getElementById("password");e.addEventListener("click",()=>{t.type==="password"?(t.type="text",e.innerHTML='<img src="public/images/visible_off.svg" alt="hide password icon">',e.setAttribute("aria-label","Hide password")):(t.type="password",e.innerHTML='<img src="public/images/visible.svg" alt="show password icon">',e.setAttribute("aria-label","Show password"))})}bindLoginSubmit(e){document.getElementById("login-form").addEventListener("submit",s=>{s.preventDefault(),e()})}}class K{constructor(e,t,s){this.view=e,this.userModel=t,this.router=s,this.init()}init(){this.view.setupPasswordToggle(),this.view.bindLoginSubmit(this.handleLoginSubmit.bind(this))}async handleLoginSubmit(){const e=this.view.getEmail(),t=this.view.getPassword();if(!e||!t){this.view.showMessage("Please fill in all fields","error");return}try{this.view.showLoading(),await this.userModel.login(e,t),this.view.showMessage("Login successful!","success"),setTimeout(()=>{this.router.navigateTo("/")},1500)}catch(s){this.view.showMessage(s.message||"Login failed","error")}finally{this.view.hideLoading()}}}class Z{constructor(){this.view=new J,this.model=new P,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new K(this.view,this.model,{navigateTo:e=>{window.location.hash=e}})}}class Q{getTemplate(){return`
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
              <label for="location">Add Location</label>
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
    `}getDescription(){return document.getElementById("description").value.trim()}getPhotoFile(){return document.getElementById("photo").files[0]}getLocationCoordinates(){const e=document.getElementById("latitude").value||null,t=document.getElementById("longitude").value||null;return{lat:e,lng:t}}setLocationCoordinates(e,t){document.getElementById("latitude").value=e,document.getElementById("longitude").value=t}clearLocationCoordinates(){document.getElementById("latitude").value="",document.getElementById("longitude").value=""}updatePhotoInput(e){const t=document.getElementById("photo"),s=new DataTransfer;s.items.add(e),t.files=s.files}showMessage(e,t){const s=document.getElementById("message");s.textContent=e,s.className="message",s.classList.add(t)}setupFilePreview(){const e=document.getElementById("photo"),t=document.getElementById("image-preview");e.addEventListener("change",s=>{const i=s.target.files[0];if(i){const a=new FileReader;a.onload=r=>{t.src=r.target.result,t.style.display="block",this.showMessage(`Image ${i.name} selected`,"info")},a.readAsDataURL(i)}else t.style.display="none"})}updateLocationStatus(e,t,s=!0){const i=document.getElementById("location-status");s&&e&&t?(i.textContent=`Location set: ${Number(e).toFixed(6)}, ${Number(t).toFixed(6)}`,i.classList.add("location-set")):(i.textContent="No location selected",i.classList.remove("location-set"))}disableForm(e=!0){const t=document.getElementById("upload-form"),s=t.querySelector('button[type="submit"]'),i=t.querySelectorAll("input, textarea, button");s.disabled=e,i.forEach(a=>a.disabled=e),e?(s.setAttribute("aria-busy","true"),s.textContent="Uploading..."):(s.removeAttribute("aria-busy"),s.textContent="Upload Story")}resetForm(){const e=document.getElementById("upload-form"),t=document.getElementById("image-preview");e.reset(),t.style.display="none",this.updateLocationStatus(null,null,!1)}bindCameraButton(e){document.getElementById("camera-button").addEventListener("click",e)}bindCloseCamera(e){document.getElementById("close-camera").addEventListener("click",e)}bindCaptureButton(e){document.getElementById("capture-button").addEventListener("click",e)}bindGetLocationButton(e){document.getElementById("get-location").addEventListener("click",e)}bindResetLocationButton(e){document.getElementById("reset-location").addEventListener("click",e)}bindFormSubmit(e){document.getElementById("upload-form").addEventListener("submit",s=>{s.preventDefault(),e()})}updateImagePreview(e){const t=document.getElementById("image-preview");t.src=e,t.style.display="block",this.showMessage("Photo captured successfully","success")}navigateToHome(){setTimeout(()=>{window.location.hash="#/"},2e3)}}class X{isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}async uploadStory(e,t,s=null,i=null){try{if(!this.isUserLoggedIn())throw new Error("You must be logged in to upload stories");return{success:!0,data:await z(e,t,s,i)}}catch(a){return{success:!1,error:a.message||"Failed to upload story"}}}validateStoryData(e,t){const s=[];return e||s.push("Please enter a story description"),t||s.push("Please select an image or take a photo"),{isValid:s.length===0,errors:s}}}class ee{static async createFileFromBlob(e,t){return new File([e],t,{type:e.type})}static updateFileInput(e,t){const s=new DataTransfer;s.items.add(t),e.files=s.files}static validateImageFile(e){return["image/jpeg","image/jpg","image/png","image/gif"].includes(e.type)?e.size>5242880?{isValid:!1,error:"File size must be less than 5MB"}:{isValid:!0}:{isValid:!1,error:"Please select a valid image file (JPEG, PNG, or GIF)"}}}class te{constructor(e,t,s,i){this.view=e,this.model=t,this.mapHandler=s,this.cameraHandler=i,this.isInitialized=!1,this.eventListeners=[]}async init(){if(!this.model.isUserLoggedIn())return this.view.showLoginMessage(),!1;const e=this.model.getUserName();return this.view.showAuthenticatedUser(e),this.view.setupFilePreview(),this.bindEventHandlers(),await this.initializeMap(),this.setupCleanup(),this.isInitialized=!0,!0}setupCleanup(){const e=this.cleanup.bind(this),t=this.cleanup.bind(this),s=()=>{document.hidden&&this.cleanup()};window.addEventListener("beforeunload",e),window.addEventListener("hashchange",t),document.addEventListener("visibilitychange",s),this.eventListeners=[{element:window,event:"beforeunload",handler:e},{element:window,event:"hashchange",handler:t},{element:document,event:"visibilitychange",handler:s}]}cleanup(){this.cameraHandler&&this.isInitialized&&this.cameraHandler.closeCamera(),this.eventListeners.forEach(({element:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),this.eventListeners=[],this.isInitialized=!1}bindEventHandlers(){this.view.bindCameraButton(this.handleOpenCamera.bind(this)),this.view.bindCloseCamera(this.handleCloseCamera.bind(this)),this.view.bindCaptureButton(this.handleCapturePhoto.bind(this)),this.view.bindGetLocationButton(this.handleGetLocation.bind(this)),this.view.bindResetLocationButton(this.handleResetLocation.bind(this)),this.view.bindFormSubmit(this.handleFormSubmit.bind(this))}async initializeMap(){try{const e=await this.mapHandler.init("location-map");return e.success?(this.mapHandler.map.on("click",t=>{const{lat:s,lng:i}=t.latlng;this.view.setLocationCoordinates(s,i),this.view.updateLocationStatus(s,i),this.view.showMessage("Location selected from map","info")}),!0):(this.view.showMessage(`Error initializing map: ${e.error}`,"error"),!1)}catch(e){return this.view.showMessage(`Failed to load map: ${e.message}`,"error"),console.error("Map initialization error:",e),!1}}async handleOpenCamera(){const e=await this.cameraHandler.openCamera();e.success?this.view.showMessage("Camera activated. Click 'Capture Photo' when ready.","info"):this.view.showMessage(e.error,"error")}handleCloseCamera(){this.cameraHandler.closeCamera(),this.view.showMessage("Camera closed","info")}async handleCapturePhoto(){const e=this.cameraHandler.capturePhoto();if(e.success){this.view.updateImagePreview(e.imageDataUrl);const t=await ee.createFileFromBlob(e.blob,"camera-photo.jpg");this.view.updatePhotoInput(t),this.cameraHandler.closeCamera()}}async handleGetLocation(){this.view.showMessage("Getting your location...","info");const e=await this.mapHandler.getUserLocation();e.success?(this.view.setLocationCoordinates(e.latitude,e.longitude),this.view.updateLocationStatus(e.latitude,e.longitude),this.view.showMessage("Location detected successfully!","success")):this.view.showMessage(e.error,"error")}handleResetLocation(){this.mapHandler.clearMarker(),this.mapHandler.resetView(),this.view.clearLocationCoordinates(),this.view.updateLocationStatus(null,null,!1),this.view.showMessage("Location has been reset","info")}async handleFormSubmit(){const e=this.view.getDescription(),t=this.view.getPhotoFile(),{lat:s,lng:i}=this.view.getLocationCoordinates(),a=this.model.validateStoryData(e,t);if(!a.isValid){this.view.showMessage(a.errors[0],"error");return}try{this.view.disableForm(!0),this.view.showMessage("Uploading your story...","info");const r=await this.model.uploadStory(e,t,s,i);if(r.success)this.view.showMessage("Your story has been uploaded successfully!","success"),this.view.resetForm(),this.mapHandler&&this.mapHandler.clearMarker(),this.cleanup(),this.view.navigateToHome();else throw new Error(r.error)}catch(r){this.view.showMessage(r.message||"Failed to upload story","error"),console.error("Upload error:",r)}finally{this.view.disableForm(!1)}}}var y,T,N;class se{constructor(){g(this,y);this.stream=null,this.videoElement=null,this.containerElement=null,this.isActive=!1,this.errorCallbacks=[]}onError(e){this.errorCallbacks.push(e)}init(e,t){this.videoElement=e,this.containerElement=t}async openCamera(){try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Camera access is not supported in this browser");return this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}}),this.videoElement.srcObject=this.stream,this.containerElement.style.display="block",this.isActive=!0,{success:!0}}catch(e){return v(this,y,T).call(this,e,"openCamera"),{success:!1,error:v(this,y,N).call(this,e)}}}closeCamera(){this.stream&&(this.stream.getTracks().forEach(e=>{e.stop(),console.log("Camera track stopped:",e.kind)}),this.stream=null),this.videoElement&&(this.videoElement.srcObject=null),this.containerElement&&(this.containerElement.style.display="none"),this.isActive=!1}isActiveCamera(){return this.isActive&&this.stream&&this.stream.active}capturePhoto(){if(!this.stream||!this.isActive)return{success:!1};const e=document.createElement("canvas"),t=e.getContext("2d");e.width=this.videoElement.videoWidth,e.height=this.videoElement.videoHeight,t.drawImage(this.videoElement,0,0,e.width,e.height);const s=e.toDataURL("image/jpeg"),i=this._dataURLtoBlob(s);return{success:!0,imageDataUrl:s,blob:i}}_dataURLtoBlob(e){const t=e.split(";base64,"),s=t[0].split(":")[1],i=window.atob(t[1]),a=i.length,r=new Uint8Array(a);for(let n=0;n<a;++n)r[n]=i.charCodeAt(n);return new Blob([r],{type:s})}}y=new WeakSet,T=function(e,t="camera"){console.error(`Camera error in ${t}:`,e),this.errorCallbacks.forEach(s=>s(e,t))},N=function(e){switch(e.name){case"NotAllowedError":return"Camera access was denied. Please allow camera access in your browser settings.";case"NotFoundError":return"No camera found on this device.";case"NotSupportedError":return"Camera is not supported in this browser.";case"NotReadableError":return"Camera is already in use by another application.";default:return`Could not access camera: ${e.message}`}};const ie="modulepreload",oe=function(o){return"/Story-app/"+o},C={},ae=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),n=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));i=Promise.allSettled(t.map(h=>{if(h=oe(h),h in C)return;C[h]=!0;const S=h.endsWith(".css"),$=S?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${$}`))return;const m=document.createElement("link");if(m.rel=S?"stylesheet":ie,S||(m.as="script"),m.crossOrigin="",m.href=h,n&&m.setAttribute("nonce",n),document.head.appendChild(m),S)return new Promise((D,F)=>{m.addEventListener("load",D),m.addEventListener("error",()=>F(new Error(`Unable to preload CSS for ${h}`)))})}))}function a(r){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=r,window.dispatchEvent(n),!n.defaultPrevented)throw r}return i.then(r=>{for(const n of r||[])n.status==="rejected"&&a(n.reason);return e().catch(a)})};class U{constructor(){this.map=null,this.marker=null,this.leaflet=null}async init(e,t={}){const i={...{center:[-6.2088,106.8456],zoom:13},...t};await this._loadLeafletCSS();try{return this.leaflet=await ae(()=>import("./leaflet-src-r9KgTLRM.js").then(a=>a.l),[]),this.map=this.leaflet.map(e),this.leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),this.map.setView(i.center,i.zoom),this.map.on("click",a=>{this.setMarker(a.latlng.lat,a.latlng.lng)}),{success:!0,map:this.map}}catch(a){return console.error("Error initializing map:",a),{success:!1,error:`Could not initialize map: ${a.message}`}}}setMarker(e,t,s=!0){if(!this.map||!this.leaflet)return;this.marker&&this.map.removeLayer(this.marker);const i=this.leaflet.divIcon({className:"custom-marker",html:'<div class="custom-marker-pin"></div>',iconSize:[30,30],iconAnchor:[15,30]});this.marker=this.leaflet.marker([e,t],{icon:i}).addTo(this.map).bindTooltip("Selected Location",{className:"marker-tooltip"}),s&&this.map.setView([e,t],this.map.getZoom())}async getUserLocation(){return new Promise(e=>{if(!navigator.geolocation){e({success:!1,error:"Geolocation is not supported by your browser"});return}navigator.geolocation.getCurrentPosition(t=>{const{latitude:s,longitude:i}=t.coords;this.map&&(this.setMarker(s,i,!0),this.map.setZoom(15)),e({success:!0,latitude:s,longitude:i})},t=>{e({success:!1,error:`Could not get your location: ${t.message}`})})})}getMarkerPosition(){if(!this.marker)return null;const e=this.marker.getLatLng();return{latitude:e.lat,longitude:e.lng}}clearMarker(){this.marker&&this.map&&(this.map.removeLayer(this.marker),this.marker=null)}resetView(e=[-6.2088,106.8456],t=13){this.map&&this.map.setView(e,t)}_loadLeafletCSS(){return new Promise(e=>{if(document.querySelector('link[href*="leaflet.css"]')){e();return}const t=document.createElement("link");t.rel="stylesheet",t.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",t.integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",t.crossOrigin="",t.onload=e,document.head.appendChild(t)})}}class re{constructor(){this.view=new Q,this.model=new X,this.mapHandler=new U,this.cameraHandler=new se,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){const e=document.getElementById("camera-preview"),t=document.getElementById("camera-container");e&&t&&this.cameraHandler.init(e,t),this.presenter=new te(this.view,this.model,this.mapHandler,this.cameraHandler),await this.presenter.init()}cleanup(){this.presenter&&this.presenter.cleanup()}}function R(o){const e=o.split("/");return{resource:e[1]||null,id:e[2]||null}}function ne(o){let e="";return o.resource&&(e=e.concat(`/${o.resource}`)),o.id&&(e=e.concat("/:id")),e||"/"}function A(){return location.hash.replace("#","")||"/"}function ce(){const o=A(),e=R(o);return ne(e)}function le(){const o=A();return R(o)}function de(o,e="en-US",t={}){return new Date(o).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric",...t})}function E(o,e,t){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){const s=e[e.length-1];return Object.keys(s).forEach(i=>{i!=="offset"&&i!=="easing"&&i!=="composite"&&(o.style[i]=s[i])}),null}return o.animate(e,t)}class ue{getTemplate(){return`
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
    `}showLoading(){const e=document.getElementById("story-container");e.innerHTML="<p class='loading-text'>Loading story details...</p>"}showError(e){const t=document.getElementById("story-container");t.innerHTML=`<p class="error-message">Error: ${e}</p>`}displayStory(e,t,s=!1){const i=document.getElementById("story-container");let a=`
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
    `;s&&(a+=`
        <div class="detail-story-location">
          <h3>Location</h3>
          <div id="story-map" class="story-map" aria-label="Map showing story location"></div>
        </div>
      `),a+="</div>",i.innerHTML=a}animateStoryElements(){const e=document.querySelector(".detail-story-header"),t=document.querySelector(".detail-story-image"),s=document.querySelector(".detail-story-content"),i=document.querySelector(".detail-story-location");e&&E(e,[{opacity:0,transform:"translateY(-20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards"}),t&&E(t,[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:800,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:200}),s&&E(s,[{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:400}),i&&E(i,[{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:600,easing:"cubic-bezier(0.2, 0, 0.2, 1)",fill:"forwards",delay:600})}animateMapContainer(){const e=document.getElementById("story-map");e&&E(e,[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:800,easing:"ease-out",fill:"forwards"})}}class he{async getStoryDetail(e){try{return(await q(e)).story}catch(t){throw new Error(`Failed to fetch story details: ${t.message}`)}}isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){return localStorage.getItem("name")||"User"}}class me{constructor(e,t,s){this.view=e,this.model=t,this.mapHandler=s}async init(e){if(!this.model.isUserLoggedIn()){this.view.showLoginMessage();return}const t=this.model.getUserName();if(this.view.showAuthenticatedUser(t),!e){this.view.showError("Story ID not found in URL");return}try{this.view.showLoading();const s=await this.model.getStoryDetail(e);if(!s){this.view.showError("Story not found");return}const i=de(s.createdAt),a=!!(s.lat&&s.lon);this.view.displayStory(s,i,a),this.view.animateStoryElements(),a&&await this.initializeMap(s)}catch(s){this.view.showError(s.message),console.error("Error loading story:",s)}}async initializeMap(e){try{(await this.mapHandler.init("story-map",{center:[e.lat,e.lon],zoom:15})).success&&(this.mapHandler.setMarker(e.lat,e.lon),this.view.animateMapContainer())}catch(t){console.error("Error initializing map:",t)}}}class ge{constructor(){this.view=new ue,this.model=new he,this.mapHandler=new U,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){this.presenter=new me(this.view,this.model,this.mapHandler);const{id:e}=le();await this.presenter.init(e)}}class pe{getTemplate(){return`
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
    `}updateNotificationStatus(e,t=!0){const s=document.getElementById("notification-status"),i=document.getElementById("enable-notifications"),a=document.getElementById("disable-notifications");if(!t){s.innerHTML=`
        <div class="status-indicator error">
          <span class="status-icon">❌</span>
          <span>Push notifications are not supported in this browser</span>
        </div>
      `,i.style.display="none",a.style.display="none";return}e?(s.innerHTML=`
        <div class="status-indicator success">
          <span class="status-icon">✅</span>
          <span>Push notifications are enabled</span>
        </div>
      `,i.style.display="none",a.style.display="inline-block"):(s.innerHTML=`
        <div class="status-indicator">
          <span class="status-icon">🔕</span>
          <span>Push notifications are disabled</span>
        </div>
      `,i.style.display="inline-block",a.style.display="none")}showMessage(e,t="info"){const s=document.getElementById("notification-message");s.textContent=e,s.className="message",s.classList.add(t)}setLoading(e){const t=document.getElementById("enable-notifications"),s=document.getElementById("disable-notifications");e?(t.disabled=!0,s.disabled=!0,t.textContent="Processing...",s.textContent="Processing..."):(t.disabled=!1,s.disabled=!1,t.textContent="Enable Notifications",s.textContent="Disable Notifications")}bindEnableNotifications(e){document.getElementById("enable-notifications").addEventListener("click",e)}bindDisableNotifications(e){document.getElementById("disable-notifications").addEventListener("click",e)}}class we{isUserLoggedIn(){return!!localStorage.getItem("token")}getUserName(){const e=localStorage.getItem("user_session");if(e)try{return JSON.parse(e).name}catch(t){return console.error("Error parsing user data:",t),"User"}return"User"}getNotificationPermission(){return"Notification"in window?Notification.permission:"default"}isNotificationSupported(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window}}class fe{constructor(e,t,s){this.view=e,this.model=t,this.pushManager=s}async init(){if(!this.model.isUserLoggedIn())return this.view.showLoginMessage(),!1;const e=this.model.getUserName();return this.view.showAuthenticatedUser(e),this.bindEventHandlers(),await this.checkNotificationStatus(),!0}bindEventHandlers(){this.view.bindEnableNotifications(this.handleEnableNotifications.bind(this)),this.view.bindDisableNotifications(this.handleDisableNotifications.bind(this))}async checkNotificationStatus(){try{if(!this.model.isNotificationSupported()){this.view.updateNotificationStatus(!1,!1);return}const t=await this.pushManager.getSubscriptionStatus();this.view.updateNotificationStatus(t.isSubscribed,!0)}catch(e){console.error("Error checking notification status:",e),this.view.showMessage("Error checking notification status","error")}}async handleEnableNotifications(){try{this.view.setLoading(!0),this.view.showMessage("Setting up notifications...","info");const e=await this.pushManager.requestPermission();if(!e.success)throw new Error(e.error);const t=await this.pushManager.subscribe();if(!t.success)throw new Error(t.error);this.view.updateNotificationStatus(!0,!0),this.view.showMessage("Notifications enabled successfully!","success")}catch(e){console.error("Error enabling notifications:",e),this.view.showMessage(e.message||"Failed to enable notifications","error")}finally{this.view.setLoading(!1)}}async handleDisableNotifications(){try{this.view.setLoading(!0),this.view.showMessage("Disabling notifications...","info");const e=await this.pushManager.unsubscribe();if(!e.success)throw new Error(e.error);this.view.updateNotificationStatus(!1,!0),this.view.showMessage("Notifications disabled successfully","success")}catch(e){console.error("Error disabling notifications:",e),this.view.showMessage(e.message||"Failed to disable notifications","error")}finally{this.view.setLoading(!1)}}}class ve{constructor(){this.view=new pe,this.model=new we,this.presenter=null}async render(){return this.view.getTemplate()}async afterRender(){const e=window.pushManager;if(!e){console.error("Push manager not initialized");return}this.presenter=new fe(this.view,this.model,e),await this.presenter.init()}cleanup(){this.presenter&&typeof this.presenter.cleanup=="function"&&this.presenter.cleanup()}}const ye=()=>{const o=document.createElement("div");return o.setAttribute("role","main"),o.setAttribute("aria-label","Page not found"),o.classList.add("not-found-container"),o.innerHTML=`
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="#/" class="back-home-button" aria-label="Back to home page">
        Back to Home
      </a>
    </div>
  `,o},k={async render(){return ye()},async afterRender(){const o=document.querySelector(".back-home-button");o&&o.addEventListener("click",e=>{e.preventDefault(),window.location.hash="/"})}},be={"/":new V,"/uploadStory":new re,"/login":new Z,"/register":new W,"/detail/:id":new ge,"/notifications":new ve,"/not-found":k,"*":k};var d,p,u,w,f,H,B;class Ee{constructor({navigationDrawer:e,drawerButton:t,content:s}){g(this,f);g(this,d,null);g(this,p,null);g(this,u,null);g(this,w,null);b(this,d,s),b(this,p,t),b(this,u,e),v(this,f,H).call(this)}async renderPage(){const e=ce(),t=be[e];c(this,w)&&typeof c(this,w).cleanup=="function"&&c(this,w).cleanup(),document.startViewTransition&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches?await document.startViewTransition(async()=>{c(this,d).innerHTML=await t.render(),await t.afterRender(),c(this,d).focus(),v(this,f,B).call(this)}).finished:(c(this,d).innerHTML=await t.render(),await t.afterRender(),c(this,d).focus(),v(this,f,B).call(this)),b(this,w,t)}}d=new WeakMap,p=new WeakMap,u=new WeakMap,w=new WeakMap,f=new WeakSet,H=function(){c(this,p).addEventListener("click",()=>{const e=c(this,u).classList.toggle("open");c(this,p).setAttribute("aria-expanded",e?"true":"false")}),document.body.addEventListener("click",e=>{!c(this,u).contains(e.target)&&!c(this,p).contains(e.target)&&c(this,u).classList.remove("open"),c(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&c(this,u).classList.remove("open")})})},B=function(){const e=c(this,d).querySelector("h1");if(e){const t=document.createElement("div");t.setAttribute("aria-live","assertive"),t.classList.add("visually-hidden"),t.textContent=`Navigated to ${e.textContent}`,document.body.appendChild(t),setTimeout(()=>{document.body.removeChild(t)},1e3)}};class Se{constructor(){this.vapidPublicKey="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",this.subscription=null,this.isSupported=this.checkSupport(),this.eventListeners=[]}checkSupport(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window}async init(){if(!this.isSupported)return console.warn("Push notifications are not supported in this browser"),{success:!1,error:"Not supported"};try{const e=await navigator.serviceWorker.register("/sw.js");return console.log("Service Worker registered:",e),await navigator.serviceWorker.ready,{success:!0,registration:e}}catch(e){return console.error("Service Worker registration failed:",e),{success:!1,error:e.message}}}async requestPermission(){if(!this.isSupported)return{success:!1,error:"Not supported"};try{const e=await Notification.requestPermission();return e==="granted"?{success:!0,permission:e}:{success:!1,error:"Permission denied"}}catch(e){return console.error("Error requesting notification permission:",e),{success:!1,error:e.message}}}async subscribe(){try{const e=await navigator.serviceWorker.ready,t=await e.pushManager.getSubscription();if(t)return this.subscription=t,{success:!0,subscription:t};const s=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(this.vapidPublicKey)});return this.subscription=s,await this.sendSubscriptionToServer(s),{success:!0,subscription:s}}catch(e){return console.error("Error subscribing to push notifications:",e),{success:!1,error:e.message}}}async unsubscribe(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(await t.unsubscribe(),await this.removeSubscriptionFromServer(t),this.subscription=null,{success:!0}):{success:!0,message:"No active subscription"}}catch(e){return console.error("Error unsubscribing from push notifications:",e),{success:!1,error:e.message}}}async sendSubscriptionToServer(e){const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const s={endpoint:e.endpoint,keys:{p256dh:this.arrayBufferToBase64(e.getKey("p256dh")),auth:this.arrayBufferToBase64(e.getKey("auth"))}},i=await fetch(`${l.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(s)}),a=await i.json();if(!i.ok)throw new Error(a.message||"Failed to subscribe to notifications");return a}async removeSubscriptionFromServer(e){const t=localStorage.getItem("token");if(!t)throw new Error("User not authenticated");const s=await fetch(`${l.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:e.endpoint})}),i=await s.json();if(!s.ok)throw new Error(i.message||"Failed to unsubscribe from notifications");return i}async getSubscriptionStatus(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return{isSubscribed:!!t,subscription:t}}catch(e){return console.error("Error getting subscription status:",e),{isSubscribed:!1,subscription:null}}}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),s=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(s),a=new Uint8Array(i.length);for(let r=0;r<i.length;++r)a[r]=i.charCodeAt(r);return a}arrayBufferToBase64(e){const t=new Uint8Array(e);let s="";for(let i=0;i<t.byteLength;i++)s+=String.fromCharCode(t[i]);return window.btoa(s)}cleanup(){this.eventListeners.forEach(({element:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),this.eventListeners=[]}}document.addEventListener("DOMContentLoaded",async()=>{const o=new Ee({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")}),e=new Se;window.pushManager=e;const t=await e.init();t.success?console.log("Push notifications initialized successfully"):console.warn("Push notifications initialization failed:",t.error),await o.renderPage(),window.addEventListener("hashchange",async()=>{await o.renderPage()});const s=document.querySelector("#main-content"),i=document.querySelector(".skip-link");i&&s&&i.addEventListener("click",function(a){a.preventDefault(),i.blur(),s.focus(),s.scrollIntoView({behavior:"smooth",block:"start"});const r=document.createElement("div");r.setAttribute("aria-live","assertive"),r.className="visually-hidden",r.textContent="Skipped to main content",document.body.appendChild(r),setTimeout(()=>{document.body.removeChild(r)},1e3)})});
