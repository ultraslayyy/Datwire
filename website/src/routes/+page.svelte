<script lang='ts'>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let servers: any = [];

    onMount(async () => {
        const res = await fetch('http://localhost:5001/api/getServers/servers');
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.dbServers)) {
            servers = data.dbServers;
            console.log(servers);
        }
    });

    function openServerPage(guid: string) {
        goto(`/servers/${guid}`);
    }
</script>

<div class="left-column">
    {#each servers as server}
        <div class="server-box" on:click={() => openServerPage(server.guid)}>
            <div class="server-name">{server.name}</div>
            <div class="server-owner">
                Owner: {server.owner}
            </div>
        </div>
    {/each}
</div>

<p>I'm doing nerdy things 👍</p>
<p>This vc is insane!</p>

<style>
    .left-column {
        width: 25%;
        min-height: 100vh;
        padding: 1rem;
        background-color: #f3f4f6; /* Tailwind's gray-100 */
    }
  
    .server-box {
        background-color: white;
        border-left: 4px solid #3b82f6; /* Tailwind blue-500 */
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  
    .server-name {
        font-weight: 600;
        font-size: 1.1rem;
    }
  
    .server-owner {
        font-size: 0.875rem;
        color: #6b7280; /* Tailwind gray-500 */
    }
  </style>