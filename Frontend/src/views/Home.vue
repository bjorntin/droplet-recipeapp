<template>
  <div class="home">
    <!-- Main Content Sections -->
    <section class="section hero-section">
      <h2 class="section-title">Welcome to a Healthier You!</h2>
      <p class="section-paragraph">
        Join us on a journey to healthier living with personalized meal plans, sustainable recipes,
        and reducing food waste. Start making a difference today!
      </p>
      <router-link to="/recipe-search" class="cta-link">
        <button class="cta-button">Find Your Recipe</button>
      </router-link>
    </section>

    <!-- About Us Section -->
    <section class="section about-us">
      <div class="about-us-content">
        <div class="about-text">
          <h2 class="section-title">What We Do</h2>
          <p class="section-paragraph">
            We help you eat healthy, save time, and reduce food waste. Our app provides tailored
            recipes to suit your dietary needs, helping you create delicious meals with the
            ingredients you already have.
          </p>
        </div>
        <div class="about-grid">
          <div class="grid-item">
            <h3><strong>Healthy Recipes</strong></h3>
            <p>Get personalized meal recommendations for your dietary needs.</p>
          </div>
          <div class="grid-item">
            <h3><strong>Sustainable Cooking</strong></h3>
            <p>
              Make meals with what you already have, reducing food waste and supporting
              sustainability.
            </p>
          </div>
          <div class="grid-item">
            <h3><strong>Earn Rewards</strong></h3>
            <p>
              Receive points for contributing recipes and making healthy choices. Redeem your points
              for vouchers and more!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <h2 class="section-title">How It Works</h2>
      <div class="how-it-works-grid">
        <div class="how-it-works-box">
          <img src="../assets/search.png" alt="search" class="how-it-works-image-search" />
          <h3>Search Recipes</h3>
          <p>Find delicious recipes based on ingredients you already have in your fridge.</p>
        </div>
        <div class="how-it-works-box">
          <img src="../assets/save.png" alt="save" class="how-it-works-image-save" />
          <h3>Save & Organize</h3>
          <p>Save your favorite recipes and organize them for easy access.</p>
        </div>
        <div class="how-it-works-box">
          <img src="../assets/share.png" alt="share" class="how-it-works-image-share" />
          <h3>Create & Share</h3>
          <p>Submit your own recipes and share them with the community!</p>
        </div>
        <div class="how-it-works-box">
          <img src="../assets/list.png" alt="list" class="how-it-works-image-list" />
          <h3>Generate Shopping List</h3>
          <p>Create a shopping list based on recipes you want to try next.</p>
        </div>
      </div>
    </section>

    <!-- Statistics Section
    <section class="statistics">
      <h2 class="section-title">Our Impact</h2>
      <div class="stat-box">
        <div class="stat-value" v-cloak>240+</div>
        <p class="stat-label">users actively reducing food wastage</p>
      </div>
      <div class="stat-box">
        <div class="stat-value" v-cloak>500+</div>
        <p class="stat-label">healthy recipes shared</p>
      </div>
      <div class="stat-box">
        <div class="stat-value" v-cloak>1000+</div>
        <p class="stat-label">meals saved from going to waste</p>
      </div>
    </section> -->

    <!-- Call to Action Section -->
    <section class="cta-section">
      <h2 class="cta-title">Start Saving Food & Eating Healthier Today!</h2>
      <p class="cta-paragraph">
        Ready to make a difference? Join us and start cooking healthier meals with the ingredients
        you already have!
      </p>
      <router-link to="/signup" class="cta-link">
        <button class="cta-button">Sign Up Now</button>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      auth: false
    }
  }
}
</script>

<style scoped>
/* General styling */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

/* Main content sections */
.hero-section {
  padding: 80px;
  background-color: #f7f3ed;
  text-align: center;
  border-bottom: 2px solid #e0ebe4;
}

.hero-section .section-title {
  font-size: 3rem;
  color: #5d4037;
  margin-bottom: 20px;
}

.hero-section .section-paragraph {
  color: black;
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.cta-link {
  text-decoration: none;
}

.cta-button {
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  background-color: #5e9b77;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #3d6a52;
}

/* About Us Section */
.about-us {
  padding: 160px 60px;
  background-color: #e0ebe4;
}

.about-us .about-us-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.about-us .about-text {
  flex: 1;
  max-width: 45%;
  /* text-align: center; */
}

.about-us .section-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 20px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.about-us .section-paragraph {
  color: #4b8063;
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 40px;
  /* text-align: center; */
}

.about-us .about-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

@media (max-width: 768px) {
  .about-us .about-text {
    max-width: 80%; /* Increase max width for smaller screens */
  }

  .about-us .about-grid {
    grid-template-columns: 1fr; /* Stack grid items vertically */
  }

  .grid-item {
    padding: 15px; /* Adjust padding for smaller screens */
  }
}

@media (max-width: 480px) {
  .about-us .section-title {
    font-size: 2rem; /* Reduce font size */
  }

  .about-us .about-text,
  .about-us .about-grid {
    padding: 10px;
  }

  .about-us .section-paragraph {
    font-size: 1rem; /* Reduce font size */
  }

  .about-us .about-text {
    text-align: center;
  }

  .grid-item h3 {
    font-size: 1.2rem; /* Adjust font size for headings */
  }

  .grid-item p {
    font-size: 0.9rem; /* Adjust font size for paragraphs */
  }
}

.grid-item h3 {
  font-size: 1.5rem;
  color: #4b8063;
  margin-bottom: 10px;
}

.grid-item p {
  font-size: 1rem;
  color: #795548;
}

/* How It Works Section */
.how-it-works {
  padding: 90px 20px;
  background-color: #f7f3ed;
  text-align: center;
}

.how-it-works .section-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 90px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.how-it-works-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.how-it-works-box {
  background-color: #e6e6e6;
  display: inline-block;
  align-items: center;
  padding: 35px 25px 25px 25px;
  border-radius: 12px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.how-it-works-box:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.how-it-works-box h3 {
  font-size: 1.6rem;
  color: #4b8063;
  margin-bottom: 15px;
}

.how-it-works-box p {
  font-size: 1rem;
  color: #795548;
}

.how-it-works-image-search {
  max-width: 70px;
  margin-bottom: 20px;
}

.how-it-works-image-save {
  max-width: 70px;
  margin-bottom: 20px;
}

.how-it-works-image-share {
  max-width: 120px;
  /* margin-bottom: 20px; */
  margin-top: -30px;
}

.how-it-works-image-list {
  max-width: 80px;
  margin-bottom: 20px;
}

/* Statistics Section */
.statistics {
  padding: 80px 20px;
  background-color: #e0ebe4;
  text-align: center;
  animation: fadeIn 1s ease-out;
}

.statistics .section-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 60px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.stat-box {
  display: inline-block;
  background: linear-gradient(135deg, #6abf6b, #4b8063);
  padding: 30px;
  margin: 0px 40px;
  border-radius: 12px;
  width: 180px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  animation: scaleUp 1.5s ease-out forwards;
}

.stat-box:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.2rem;
  color: white;
  font-weight: 400;
}

/* Keyframe Animations */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes scaleUp {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Media Queries for smaller screens */
@media (max-width: 1200px) {
  .stat-box {
    width: 100%; /* Make each stat box take up full width on medium screens */
    margin: 10px 0; /* Add margin between stat boxes */
  }
}

@media (max-width: 768px) {
  .statistics {
    padding: 60px 20px; /* Reduced padding on small screens */
  }

  .stat-box {
    width: 100%; /* Make each stat box take up full width on small screens */
    margin: 10px 0; /* Ensure space between boxes */
    padding: 20px; /* Reduce padding in the stat box */
  }

  .stat-value {
    font-size: 2.5rem; /* Reduce the size of the stat value on small screens */
  }

  .stat-label {
    font-size: 1rem; /* Reduce font size of labels */
  }
}

@media (max-width: 480px) {
  .statistics {
    padding: 40px 20px; /* Further reduced padding on extra small screens */
  }

  .stat-box {
    width: 100%; /* Ensure each box is full width on very small screens */
    margin: 10px 0;
    padding: 15px; /* Adjust padding further */
  }

  .stat-value {
    font-size: 2rem; /* Make numbers even smaller for extra small screens */
  }

  .stat-label {
    font-size: 0.9rem; /* Smaller font size for labels */
  }
}

/* CTA Section */
.cta-section {
  padding: 60px 20px;
  background-color: #4b8063;
  text-align: center;
  color: white;
}

.cta-section .cta-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-section .cta-paragraph {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

/* Media Queries */
@media (max-width: 1200px) {
  .about-us .about-us-content {
    flex-direction: column;
    align-items: center;
  }

  .about-us .about-text,
  .about-us .about-grid {
    max-width: 100%;
  }

  .how-it-works-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .how-it-works-box {
    padding: 20px;
  }

  .stat-box {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-section .section-title {
    font-size: 2.5rem;
  }

  .hero-section .section-paragraph {
    font-size: 1.25rem;
  }

  .cta-button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }

  .how-it-works-grid {
    grid-template-columns: 1fr;
  }

  .statistics .stat-box {
    width: 100%;
    margin: 10px 0;
  }

  .cta-section .cta-title {
    font-size: 2rem;
  }

  .cta-section .cta-paragraph {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-section .section-title {
    font-size: 2rem;
  }

  .hero-section .section-paragraph {
    font-size: 1rem;
  }

  .cta-button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  .about-us .section-title {
    font-size: 2rem;
  }

  .about-us .about-text,
  .about-us .about-grid {
    padding: 10px;
  }

  .about-us .section-paragraph {
    font-size: 1rem;
  }
}
</style>
