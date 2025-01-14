import { CollectionAfterChangeHook } from "payload";

export const calculateScore: CollectionAfterChangeHook = async ({
	doc,
	previousDoc,
	operation,
	req: { payload },
}) => {
	if (operation === "create") return;
	if (!doc.tournament) return;

	const scoresData = await payload.find({
		collection: "scores",
		limit: 2,
		depth: 0,
		where: {
			or: [{ "player.id": { equals: doc.playerOne } }, { "player.id": { equals: doc.playerTwo } }],
			"tournament.id": { equals: doc.tournament },
		},
	});

	const scorePlayerOneData = scoresData.docs.find((data) => doc.playerOne === data.player);
	const scorePlayerTwoData = scoresData.docs.find((data) => doc.playerTwo === data.player);

	if (scorePlayerOneData?.totalPoints === undefined) return;
	if (scorePlayerTwoData?.totalPoints === undefined) return;

	const updateScores = async (playerScoreID: unknown, newPoints: unknown) => {
		const result = await payload.update({
			collection: "scores",
			id: playerScoreID as number,
			data: {
				totalPoints: newPoints as number,
			},
		});
		console.log({ result });
	};

	const previousResult = previousDoc.result;
	const currentResult = doc.result;

	if (currentResult === "playerOneWin") {
		console.log("Handling case for currentResult: playerOneWin");
		switch (previousResult) {
			case "playerTwoWin":
				console.log("Previous result: playerTwoWin");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints + 1);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints - 1);
				return;
			case "draw":
				console.log("Previous result: draw");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints + 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints - 0.5);
				return;
			default:
				console.log("Previous result: none or default");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints + 1);
				return;
		}
	}

	if (currentResult === "playerTwoWin") {
		console.log("Handling case for currentResult: playerTwoWin");
		switch (previousResult) {
			case "playerOneWin":
				console.log("Previous result: playerOneWin");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints - 1);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints + 1);
				return;
			case "draw":
				console.log("Previous result: draw");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints - 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints + 0.5);
				return;
			default:
				console.log("Previous result: none or default");
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints + 1);
				return;
		}
	}

	if (currentResult === "draw") {
		console.log("Handling case for currentResult: draw");
		switch (previousResult) {
			case "playerOneWin":
				console.log("Previous result: playerOneWin");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints - 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints + 0.5);
				return;
			case "playerTwoWin":
				console.log("Previous result: playerTwoWin");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints + 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints - 0.5);
				return;
			default:
				console.log("Previous result: none or default");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints + 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints + 0.5);
				return;
		}
	}

	if (!currentResult) {
		console.log("Handling case for no currentResult");
		switch (previousResult) {
			case "playerOneWin":
				console.log("Previous result: playerOneWin");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints - 1);
				return;
			case "playerTwoWin":
				console.log("Previous result: playerTwoWin");
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints - 1);
				return;
			case "draw":
				console.log("Previous result: draw");
				await updateScores(scorePlayerOneData.id, scorePlayerOneData.totalPoints - 0.5);
				await updateScores(scorePlayerTwoData.id, scorePlayerTwoData.totalPoints - 0.5);
				return;
			default:
				console.log("Previous result: none or default");
				return;
		}
	}
};
