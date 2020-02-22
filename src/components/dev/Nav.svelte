<script>
	export let segment
</script>

<nav>
	<ul>
		<li><a class="{segment === 'components' ? 'selected' : ''}" href="dev/components">Components</a></li>
		<li><a class="{segment === 'tests' ? 'selected' : ''}" href="dev/tests">Tests</a></li>
		<li><a class="{segment === 'status' ? 'selected' : ''}" href="dev/status" rel="prefetch">Status</a></li>
		<li><a class="{segment === 'validate' ? 'selected' : ''}" href="dev/validate" rel="prefetch">Validate</a></li>
		<li><a class="{segment === 'webrain' ? 'selected' : ''}" href="dev/webrain" rel="prefetch">Webrain</a></li>
		<li><a class="{segment === 'app-info' ? 'selected' : ''}" href="dev/app-info" rel="prefetch">App Info</a></li>
	</ul>
</nav>

<style type="text/css">
	nav {
		border-bottom: 1px solid rgba(170,30,30,0.1);
		font-weight: 300;
		padding: 0 1em;
		position: absolute;
	}

	ul {
		margin: 0;
		padding: 0;
		white-space: nowrap;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: inline-block;
		/*float: left;*/
	}

	.selected {
		position: relative;
		display: inline-block;
		font-weight: bold;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(170,30,30);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
