const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pushing')
		.setDescription('Replies we are pushing project!')
		.addStringOption(option =>
			option.setName('project')
				.setRequired(true)
				.setDescription('The project we are pushing to echo back'),
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
			const message = `**@everyone Pushing changes (Project: ${project})...**`;
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