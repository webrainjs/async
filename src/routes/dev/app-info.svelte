<svelte:head>
	<title>App Info</title>
</svelte:head>

<h2>App Info</h2>
<pre class="app-info">
    <code>
        {JSON.stringify(appConfig, null, 4)}
	</code>
</pre>

<script>
	// noinspection NpmUsedModulesInstalled
	import appConfig from 'APP_CONFIG_PATH'
</script>

<style-js>
	import constants from '../../styles/helpers/constants';
	import templates from '../../styles/helpers/templates';

    module.exports = ({
        'pre': {
            'font-family': constants.fonts.monospace,
        },
    })
</style-js>