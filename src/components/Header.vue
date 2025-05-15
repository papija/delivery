<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/" class="logo-link">
        <div class="logo-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1831/1831875.png"
            alt="Delivery Truck Logo"
            class="logo-icon"
          />
        </div>
        TrackDelivery
      </router-link>
    </div>
    <nav class="header-nav">
      <router-link to="/" class="nav-link">
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- Крыша -->
          <path d="M3 9l9-7 9 7" />
          <!-- Стены -->
          <rect x="5" y="9" width="14" height="10" />
        </svg>
        Главная
      </router-link>
      <router-link to="/tracking" class="nav-link">
        <svg
          class="nav-icon"
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
        Отслеживание
      </router-link>
      <router-link to="/about" class="nav-link">
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        О нас
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(90deg, #4a74d6 0%, #6b93ff 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  margin: 15px;
  position: sticky;
  top: 0;
  z-index: 2000;
}

.logo {
  font-size: 24px;
  font-weight: 700;
}

.logo-link {
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  margin-right: 8px;
  font-size: 28px;
  width: 28px;
  height: 28px;
}

.header-nav {
  display: flex;
  gap: 25px;
}

.nav-link {
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.nav-link.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-icon {
  margin-right: 6px;
  font-size: 20px;
  width: 20px;
  height: 20px;
}

/* Удаляем устаревшие стили */
nav {
  padding: 0;
}

nav a {
  font-weight: normal;
  color: inherit;
}

nav a.router-link-exact-active {
  color: inherit;
}
</style>
