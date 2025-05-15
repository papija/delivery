<template>
  <div class="main-page-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Отследите вашу доставку в реальном времени</h1>
        <p class="hero-subtitle">
          Введите номер заказа и узнайте, где находится ваша посылка прямо сейчас!
        </p>
        <router-link to="/tracking" class="track-button">
          Начать отслеживание
        </router-link>
      </div>
      <div class="hero-image">
        <img src="https://cdn-icons-png.flaticon.com/512/757/757887.png" alt="Delivery Truck" class="delivery-icon">
      </div>
    </section>

    <section class="stats-section">
      <h2 class="section-title">Наши достижения</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">100+</span>
          <p class="stat-text">Доставок в месяц</p>
        </div>
        <div class="stat-card">
          <span class="stat-number">99%</span>
          <p class="stat-text">Точность отслеживания</p>
        </div>
        <div class="stat-card">
          <span class="stat-number">24/7</span>
          <p class="stat-text">Поддержка клиентов</p>
        </div>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title">Почему выбирают TrackDelivery?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <h3 class="feature-title">Точное местоположение</h3>
          <p class="feature-text">Следите за водителем на карте в реальном времени.</p>
        </div>
        <div class="feature-card">
          <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <h3 class="feature-title">Оценка времени</h3>
          <p class="feature-text">Узнайте, сколько осталось до прибытия.</p>
        </div>
        <div class="feature-card">
          <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3 class="feature-title">Поддержка 24/7</h3>
          <p class="feature-text">Наша команда всегда готова помочь вам.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
};
</script>

<style scoped>
.main-page-container {
  height: auto;
  background-color: #ffffff;
  padding: 20px;
  position: relative;
  max-width: 100%;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  animation: fadeInUp 0.5s ease-out forwards;
}

.hero-content {
  max-width: 50%;
}

.hero-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.hero-subtitle {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.5;
}

.track-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.track-button:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

.track-button:active {
  transform: scale(0.98);
}

.hero-image {
  max-width: 40%;
}

.delivery-icon {
  width: 100%;
  height: 200px;
  color: #007bff;
}

.stats-section {
  padding-top: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out forwards;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.02);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-text {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

.features-section {
  padding-top: 20px;
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.feature-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  animation: slideDown 0.5s ease-out forwards;
}

.feature-card:hover {
  transform: scale(1.02);
}

.feature-icon {
  width: 30px;
  height: 30px;
  color: #007bff;
  margin-bottom: 10px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.feature-text {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
  line-height: 1.5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .main-page-container {
    padding-top: 60px;
  }
  .hero-section {
    flex-direction: column;
    text-align: center;
  }
  .hero-content {
    max-width: 100%;
    margin-bottom: 15px;
  }
  .hero-image {
    max-width: 60%;
  }
  .hero-title {
    font-size: 24px;
  }
  .hero-subtitle {
    font-size: 14px;
  }
  .track-button {
    font-size: 14px;
  }
  .stat-card {
    padding: 10px;
  }
  .stat-number {
    font-size: 20px;
  }
  .stat-text {
    font-size: 14px;
  }
  .feature-card {
    padding: 10px;
  }
  .feature-title {
    font-size: 16px;
  }
  .feature-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .main-page-container {
    padding: 15px;
  }
  .hero-section {
    padding: 15px;
  }
  .hero-title {
    font-size: 20px;
  }
  .hero-subtitle {
    font-size: 12px;
  }
  .track-button {
    padding: 8px 15px;
    font-size: 12px;
  }
  .delivery-icon {
    height: 150px;
  }
  .stats-section,
  .features-section {
    padding: 15px;
  }
  .section-title {
    font-size: 18px;
  }
  .stat-number {
    font-size: 18px;
  }
  .stat-text {
    font-size: 12px;
  }
  .feature-title {
    font-size: 14px;
  }
  .feature-text {
    font-size: 12px;
  }
}
</style>