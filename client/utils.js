function formatMessage(message) {
    return message.replace(/:smile:/g, '😊') // Example for emoji replacement
                  .replace(/:sad:/g, '😢');
}

// Export utilities if needed
export { formatMessage };
