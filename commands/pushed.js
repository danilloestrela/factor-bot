const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pushed')
		.setDescription('Replies we are pushing project!')
		.addStringOption(option =>
			option.setName('project')
				.setRequired(true)
				.setDescription('The project we just pushed to echo back'),
		)
		.addStringOption(option =>
			option.setName('branch')
				.setRequired(true)
				.setDescription('The branch we just pushed to echo back'),
		),
	async execute(interaction) {
		// Check if the user has the required role
		if (!interaction.member.roles.cache.some(role => role.name === process.env.DEV_ROLE_NAME)) {
			return await interaction.reply({ content: 'You do not have the required role to execute this command.!', ephemeral: true });
		}

		// Get the channel object
		const devUpdatesChannelId = process.env.DEV_CHANNEL_ID;
		try {
			const channel = await interaction.client.channels.fetch(devUpdatesChannelId);
			// Get the input from the user
			const project = interaction.options.getString('project');
			if (project.length < 5) {
				return await interaction.reply({ content: 'Project name must have at least 5 characters.', ephemeral: true });
			}
			const branch = interaction.options.getString('branch');
			if (branch.length < 4) {
				return await interaction.reply({ content: 'Project name must have at least 4 characters.', ephemeral: true });
			}
			const message = `@everyone  **Project(${project}) pushed under \`\`${branch}\`\` **`;
			// Send the message
			await channel.send(message);
			await interaction.reply({ content: 'Message sent successfully!', ephemeral: true });
		}
		catch (error) {
			console.error('Error sending message:', error);
			await interaction.reply({ content: 'Failed to send message.', ephemeral: true });
		}
	},
};