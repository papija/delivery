<template>
  <footer class="footer-container">
    <div class="footer-content">
      <div class="footer-logo">
        <div class="logo-icon">
      <img src="https://cdn-icons-png.flaticon.com/512/1831/1831875.png" alt="Delivery Truck Logo" class="logo-icon">
        </div>
        <span class="logo-text">TrackDelivery</span>
      </div>
      <div class="footer-links">
        <div class="links-column">
          <h3 class="links-title">Сервисы</h3>
          <router-link to="/tracking" class="link-text">Отследить заказ</router-link>
          <router-link to="/about" class="link-text">О нас</router-link>
        </div>
        <div class="links-column">
          <h3 class="links-title">Информация</h3>
          <router-link to="/privacy" class="link-text">Политика конфиденциальности</router-link>
          <router-link to="/terms" class="link-text">Пользовательское соглашение</router-link>
        </div>
        <div class="links-column">
          <h3 class="links-title">Поддержка</h3>
          <a href="mailto:support@trackdelivery.com" class="link-text">support@trackdelivery.com</a>
          <a href="tel:+74951234567" class="link-text">+7 (495) 123-45-67</a>
        </div>
      </div>
      </div>
    <div class="footer-copyright">
      <p class="copyright-text">© 2025 TrackDelivery. Все права защищены.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer-container {
  background-color: #ffffff;
  color: #2c3e50;
  padding: 20px;
  border-top: 1px solid #e0e0e0;

  animation: fadeInUp 0.5s ease-out forwards;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 50px;
  height: 50px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #007bff;
}

.footer-links {
  display: flex;
  gap: 30px;
  flex: 2;
  flex-wrap: wrap;
}

.links-column {
  flex: 1;
}

.links-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
}

.link-text {
  display: block;
  font-size: 14px;
  color: #2c3e50;
  margin: 5px 0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-text:hover {
  color: #007bff;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icon {
  color: #2c3e50;
  font-size: 20px;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #007bff;
}

.footer-copyright {
  text-align: center;
  padding-top: 20px;

}

.copyright-text {
  font-size: 12px;
  color: #666;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .footer-logo {
    margin-bottom: 20px;
  }
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  .links-column {
    text-align: center;
  }
  .footer-contact {
    align-items: center;
    margin-top: 20px;
  }
  .social-icons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 15px;
  }
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  .logo-text {
    font-size: 18px;
  }
  .links-title {
    font-size: 14px;
  }
  .link-text {
    font-size: 12px;
  }
  .social-icon {
    font-size: 18px;
  }
  .copyright-text {
    font-size: 10px;
  }
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
</style>