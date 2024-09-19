<script>
  export let title = "Documentation";
</script>

<style>
  .container {
    display: flex;
    height: 100vh;
  }

  .leftbar {
    width: 250px;
    background-color: #f8f9fa;
    padding: 1rem;
  }

  .content {
    flex: 1;
    padding: 2rem;
  }

  .menu-item {
    margin-bottom: 10px;
  }

  .menu-item a {
    text-decoration: none;
    color: #333;
    font-size: 1.1rem;
  }

  .menu-item a:hover {
    color: #007bff;
  }
</style>

<div class="container">
  <aside class="leftbar">
    <h2>{title}</h2>
    <slot name="menu"></slot>
  </aside>

  <main class="content">
    <slot></slot>
  </main>
</div>
