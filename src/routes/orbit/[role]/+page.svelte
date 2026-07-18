<script>
  import RolePanel from '$lib/components/RolePanel.svelte';

  export let data;
</script>

<svelte:head>
  <title>{data.role.org} — Career Orbit — Robert Gregory</title>
  <meta name="description" content="{data.role.org}, {data.role.title} ({data.role.dates})." />
</svelte:head>

{#key data.role.id}
  <RolePanel role={data.role} prev={data.prev} next={data.next} />
{/key}
