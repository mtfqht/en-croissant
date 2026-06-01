import { Slider } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { soundVolumeAtom } from "@/state/atoms";
import { playSound } from "@/utils/sound";

const BASE_MARKS = [
  { value: 20, label: "20%" },
  { value: 50, label: "50%" },
  { value: 80, label: "80%" },
];

export default function VolumeSlider() {
  const [volume, setVolume] = useAtom(soundVolumeAtom);
  const [tempVolume, setTempVolume] = useState(volume * 100);

  useEffect(() => {
    setTempVolume(volume * 100);
  }, [volume]);

  return (
    <Slider
      min={0}
      max={100}
      marks={BASE_MARKS}
      w="15rem"
      value={tempVolume}
      onChange={(raw) => setTempVolume(raw)}
      onChangeEnd={(raw) => {
        setVolume(raw / 100);
        playSound(false, false);
      }}
    />
  );
}