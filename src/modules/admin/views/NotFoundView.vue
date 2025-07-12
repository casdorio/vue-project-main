<template>
  <div class="not-found-container">
    <h1>404 - Página Não Encontrada</h1>
    <p>Ops! Parece que a página que você está procurando não existe.</p>
    <router-link to="/" class="home-link">Voltar para a Página Inicial</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
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
  font-size: 3em;
  color: #e74c3c;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #2980b9;
}
</style>
