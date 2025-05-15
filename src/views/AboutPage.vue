<template>
  <div class="about-page-container">
    <h1 class="section-title">О компании TrackDelivery</h1>
    <section class="intro-history-section">
      <p class="section-text">
        TrackDelivery — это современный сервис отслеживания доставки, созданный в 2020
        году для упрощения логистики. За это время мы доставили более 50,000 заказов,
        расширили сеть до 15 городов и внедрили передовые технологии для повышения
        точности.
      </p>
    </section>

    <section class="mission-section">
      <h2 class="section-title">Цель нашей компании</h2>
      <div class="mission-content">
        <div class="mission-text">
          <p>
            Мы стремимся предоставить вам лучший опыт отслеживания доставки. Наша цель —
            точная и своевременная информация о ваших посылках, чтобы вы могли планировать
            день с уверенностью.
          </p>
        </div>
        <div class="mission-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/13343/13343632.png"
            alt="Target Icon"
            class="mission-icon"
          />
        </div>
      </div>
    </section>

    <section class="contact-section">
      <h2 class="section-title">Свяжитесь с нами</h2>
      <div class="contact-grid">
        <div class="contact-card">
          <svg
            class="contact-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <p class="contact-text">Email: support@trackdelivery.com</p>
        </div>
        <div class="contact-card">
          <svg
            class="contact-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          <p class="contact-text">Телефон: +7 (495) 123-45-67</p>
        </div>
        <div class="contact-card">
          <svg
            class="contact-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p class="contact-text">Адрес: ул. Коминтерна, д. 46, Ангарск</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-page-container {
  height: auto; /* Убираем min-height: 100vh */
  background-color: #ffffff;
  padding: 20px;
  position: relative;
}

.intro-history-section {
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  animation: fadeInUp 0.5s ease-out forwards;
}

.mission-section {
  padding-top: 20px;
}

.mission-content {
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

.mission-content:hover {
  transform: scale(1.02);
}

.mission-text {
  max-width: 60%;
}

.mission-text p {
  font-size: 16px;
  color: #2c3e50;
  line-height: 1.5;
}

.mission-image {
  max-width: 30%;
}

.mission-icon {
  width: 100%;
  height: 90px;
  color: #007bff;
}

.contact-section {
  padding-top: 20px;
  text-align: center;
  margin-bottom: 0; /* Убираем отступ снизу */
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.contact-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  animation: slideDown 0.5s ease-out forwards;
}

.contact-card:hover {
  transform: scale(1.02);
}

.contact-icon {
  width: 25px;
  height: 25px;
  color: #007bff;
  margin-bottom: 8px;
}

.contact-text {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
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
  .about-page-container {
    padding-top: 60px;
  }
  .mission-content {
    flex-direction: column;
    text-align: center;
  }
  .mission-text {
    max-width: 100%;
    margin-bottom: 15px;
  }
  .mission-image {
    max-width: 40%;
  }
  .section-title {
    font-size: 18px;
  }
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .about-page-container {
    padding: 15px;
  }
  .intro-history-section,
  .mission-section,
  .contact-section {
    padding: 15px;
  }
  .mission-image {
    max-width: 50%;
  }
  .section-title {
    font-size: 16px;
  }
  .mission-text p,
  .contact-text {
    font-size: 14px;
  }
}
</style>
