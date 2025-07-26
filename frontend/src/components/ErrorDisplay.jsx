function ErrorDisplay({ error }) {
	if (!error) {
		return null;
	}
	return <p className="text-red-500 text-center mt-1">{error.message}</p>;
}

export default ErrorDisplay;
