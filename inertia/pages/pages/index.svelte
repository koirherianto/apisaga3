<script lang="ts">
  import { Page } from "~/types/pages"
  import { Project } from "~/types/project"
  import { Topbar } from "~/types/topbar"
  import { Version } from "~/types/version"

  export let project: Project
  export let version: Version
  export let topbar: Topbar
  export let pages: Page[]
</script>

<body class="flex">
    
    <aside class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <h1 class="font-mono underline-offset-auto">{project.title}</h1>
        
        
        <div class="flex flex-col justify-between flex-1 mt-6">
            <nav class="flex-1 -mx-3 space-y-3"> 
                
                {#each pages as page}
              <a
                  class="flex items-center py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                  href="/{project.slug}/{version.slug}/{topbar.slug}/{page.slug}"
              >
                  <span class="mx-2 text-sm font-medium">{page.name}</span>
              </a>
            {/each}
          </nav>
      </div>
  </aside>
  
  <main class="flex-1 p-8">
      <!-- <slot></slot> -->
  </main>
</body>
