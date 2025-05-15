<template>
  <div class="main-page-container">
    <section class="content-section">
      <h1 class="section-title-large">Политика конфиденциальности</h1>

      <div class="content-card">
        <h2 class="section-title">1. Сбор информации</h2>
        <p class="content-text">
          Мы собираем информацию, которую вы предоставляете при использовании нашего Сервиса, включая, но не ограничиваясь, персональные данные, такие как имя, адрес электронной почты и номер телефона.
        </p>
      </div>

      <div class="content-card">
        <h2 class="section-title">2. Использование данных</h2>
        <p class="content-text">
          Собранные данные используются для предоставления и улучшения наших услуг, а также для связи с вами по вопросам, связанным с Сервисом. Мы не передаём ваши данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.
        </p>
      </div>

      <div class="content-card">
        <h2 class="section-title">3. Защита данных</h2>
        <p class="content-text">
          Мы принимаем меры для защиты вашей информации от несанкционированного доступа, включая использование шифрования и ограничение доступа к данным.
        </p>
      </div>

      <div class="content-card">
        <h2 class="section-title">4. Ваши права</h2>
        <p class="content-text">
          Вы имеете право запросить доступ к вашим данным, их исправление или удаление. Для этого свяжитесь с нами по адресу: 
          <a href="mailto:support@trackdelivery.com" class="content-link">support@trackdelivery.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ConfidentialityPage',
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

.content-section {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  animation: fadeInUp 0.5s ease-out forwards;
  text-align: center;
}

.section-title-large {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.content-card {
  position: relative;
  background-color: #ffffff;
  padding: 15px 30px; 
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  animation: slideDown 0.5s ease-out forwards;
  transition: transform 0.3s ease;
  text-align: left;
}

.content-card::before,
.content-card::after {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background-color: #007bff; 
  border-radius: 2px;
}

.content-card::before {
  left: 10px;
}

.content-card::after {
  right: 10px; 
}

.content-card:hover {
  transform: scale(1.02);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.content-text {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
  line-height: 1.5;
}

.content-link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.2s ease;
}

.content-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.content-link:active {
  transform: scale(0.98);
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
  .content-section {
    padding: 15px;
  }
  .section-title-large {
    font-size: 24px;
  }
  .section-title {
    font-size: 18px;
  }
  .content-text {
    font-size: 14px;
  }
  .content-card {
    padding: 15px 20px; 
  }
  .content-card::before,
  .content-card::after {
    width: 1.5px;
    left: 8px; 
    right: 8px; 
  }
}

@media (max-width: 480px) {
  .main-page-container {
    padding: 15px;
  }
  .content-section {
    padding: 10px;
  }
  .section-title-large {
    font-size: 20px;
  }
  .section-title {
    font-size: 16px;
  }
  .content-text {
    font-size: 12px;
  }
  .content-card {
    padding: 10px 15px; 
  }
  .content-card::before,
  .content-card::after {
    width: 1px; 
    left: 5px;
    right: 5px;
  }
}
</style>