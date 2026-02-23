import clsx from "clsx";

interface PlayerChipProps {
  name: string;
  score: number;
  isHost?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function PlayerChip({ name, score, isHost, selected, onClick }: PlayerChipProps) {
  const Content = (
    <div
      className={clsx(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
        selected
          ? "border-ember/80 bg-ember/20 text-blush"
          : "border-blush/20 bg-white/5 text-white/90 hover:border-blush/40",
      )}
    >
      <div className="font-medium">
        {name}
        {isHost ? <span className="ml-2 text-xs text-mint">HOST</span> : null}
      </div>
      <div className="text-blush">{score}</div>
    </div>
  );

  if (!onClick) {
    return Content;
  }

  return (
    <button type="button" className="w-full text-left" onClick={onClick}>
      {Content}
    </button>
  );
}
