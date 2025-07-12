<template>
  <div class="unauthorized-container">
    <h1>Acesso Não Autorizado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
    <router-link to="/admin" class="dashboard-link">Voltar para o Dashboard</router-link>
    <button @click="logout" class="logout-button">Sair</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Lógica para deslogar o usuário (remover token, limpar store, etc.)
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRoles');
  router.push('/login');
};
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-color: #f0f2f5;
  color: #333;
}

h1 {
  font-size: 2.5em;
  color: #f39c12;
  margin-bottom: 20px;
}

p {
  font-size: 1.1em;
  margin-bottom: 30px;
}

.dashboard-link, .logout-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #2ecc71;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-link:hover {
  background-color: #27ae60;
}

.logout-button {
  background-color: #e74c3c;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style>
