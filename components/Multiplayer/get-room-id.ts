import type { MultiplayerArgs } from "./use-multiplayer"

export function getRoomId(args: MultiplayerArgs): string {
	let room = `exercise::${args.exerciseId}`

	if (Number.isInteger(args.group)) room += `::group::${args.group}`
	else room += `::participant::${args.participantId}`

	return room
}
