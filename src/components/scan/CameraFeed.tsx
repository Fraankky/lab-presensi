interface CameraFeedProps {
  isColored: boolean;
}

export function CameraFeed({ isColored }: CameraFeedProps) {
  return (
    <img
      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
        isColored ? 'opacity-100' : 'opacity-60 grayscale'
      } mix-blend-overlay`}
      alt="Camera Feed"
      id="camera-feed"
    />
  );
}
