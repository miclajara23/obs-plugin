<script lang="ts">
    export let startCount: number;
    let count = startCount;
  
    export function increment() {
      count += 1;
    }
</script>

<div class="number">
    <span>My number is {count}!</span>
</div>

<style>
    .number {
        color: red;
    }
</style>