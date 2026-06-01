import { Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { getOpening } from "@/utils/chess";
import { TreeStateContext } from "./TreeStateContext";
import { useTranslation } from "react-i18next";

function OpeningName() {
  const { t } = useTranslation();
  const [openingName, setOpeningName] = useState("");
  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);
  const position = useStore(store, (s) => s.position);

  useEffect(() => {
    getOpening(root, position).then((v) => setOpeningName(v));
  }, [root, position]);

  return (
    <Text style={{ userSelect: "text" }} fz="sm">
      {t(openingName)} {}
    </Text>
  );
}

export default OpeningName;