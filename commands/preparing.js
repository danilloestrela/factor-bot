const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prepare-push')
		.setDescription('Replies with Preparing to push project!')
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
			const devsMention = process.env.DEV_MENTIONS;
			// Get the input from the user
			const project = interaction.options.getString('project');
			const message = '@everyone \n' +
                            '**Preparing to push:** \n' +
                            '- **Projects:**\n' +
                            `- ${project} \n` +
                            `cc: *${devsMention}*`;
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