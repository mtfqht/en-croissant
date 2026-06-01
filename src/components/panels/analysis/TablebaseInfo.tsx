import { Accordion, Badge, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { parseUci } from "chessops";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import useSWRImmutable from "swr/immutable";
import { match, P } from "ts-pattern";
import { useStore } from "zustand";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import { getTablebaseInfo, type TablebaseCategory } from "@/utils/lichess/api";
import classes from "./TablebaseInfo.module.css";

function TablebaseInfo({ fen, turn }: { fen: string; turn: "white" | "black" }) {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;
  const makeMove = useStore(store, (s) => s.makeMove);
  const { data, error, isLoading } = useSWRImmutable(
    ["tablebase", fen],
    async ([_, fen]) => await getTablebaseInfo(fen),
  );

  const sortedMoves = data?.moves.sort((a, b) => {
    if (a.category === "win" && b.category !== "win") {
      return 1;
    }
    if (a.category !== "win" && b.category === "win") {
      return -1;
    }
    if (a.category === "loss" && b.category !== "loss") {
      return -1;
    }
    if (a.category !== "loss" && b.category === "loss") {
      return 1;
    }
    return 0;
  });

  return (
    <Paper withBorder>
      <Accordion
        styles={{
          label: {
            padding: "0.5rem",
          },
        }}
      >
        <Accordion.Item value="tablebase">
          <Accordion.Control>
            <Group>
              <Text fw="bold">{t("Board.Analysis.Tablebase")}</Text>
              {isLoading && (
                <Group p="xs">
                  <Badge variant="transparent">{t("Common.Loading")}</Badge>
                </Group>
              )}
              {error && (
                <Text>
                  {t("Common.Error")}: {error}
                </Text>
              )}
              {data && <OutcomeBadge category={data.category} turn={turn} wins />}
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            {data && (
              <Stack gap="xs">
                <SimpleGrid cols={3}>
                  {sortedMoves!.map((m) => (
                    <Paper
                      withBorder
                      key={m.san}
                      px="xs"
                      onClick={() => {
                        makeMove({ payload: parseUci(m.uci)! });
                      }}
                      className={classes.info}
                    >
                      <Group gap="xs" justify="space-between" wrap="nowrap">
                        <Text fz="0.9rem" fw={600} ta="center">
                          {m.san}
                        </Text>
                        <OutcomeBadge
                          category={m.category}
                          dtz={Math.abs(m.dtz)}
                          dtm={m.dtm}
                          turn={turn === "white" ? "black" : "white"}
                        />
                      </Group>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Stack>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
}

function OutcomeBadge({
  category,
  turn,
  wins,
  dtz,
  dtm,
}: {
  category: TablebaseCategory;
  turn: "white" | "black";
  wins?: boolean;
  dtz?: number;
  dtm?: number;
}) {
  const { t } = useTranslation();
  const normalizedCategory = match(category)
    .with("win", () =>
      turn === "white"
        ? t("Board.Analysis.Tablebase.WhiteWins")
        : t("Board.Analysis.Tablebase.BlackWins"),
    )
    .with("loss", () =>
      turn === "white"
        ? t("Board.Analysis.Tablebase.BlackWins")
        : t("Board.Analysis.Tablebase.WhiteWins"),
    )
    .with(P.union("draw", "blessed-loss", "cursed-win"), () => t("Board.Analysis.Tablebase.Draw"))
    .with(P.union("unknown", "maybe-win", "maybe-loss"), () => t("Common.Unknown"))
    .exhaustive();

  const color = match(category)
    .with("win", () => (turn === "white" ? "white" : "black"))
    .with("loss", () => (turn === "white" ? "black" : "white"))
    .otherwise(() => "gray");

  const label = wins
    ? normalizedCategory
    : match(category)
        .with("draw", () => t("Board.Analysis.Tablebase.Draw"))
        .with("unknown", () => t("Common.Unknown"))
        .otherwise(() => {
          if (dtm !== undefined && dtm !== null) {
            // تحويل أنصاف النقلات إلى نقلات كاملة
            const movesToMate = Math.ceil(Math.abs(dtm) / 2);
            // استخدم "M" ليكون أقصر ويتوافق مع أسلوب Lichess ولا يتم قصه في الواجهة
            return `M${movesToMate}`; 
            // ملاحظة: إذا كنت مصراً على عرض كلمة DTM، يمكنك استخدام `DTM ${movesToMate}` 
            // لكن قد تحتاج لتغيير عدد الأعمدة في SimpleGrid إلى 2 لتفادي القص
          }
          if (dtz !== undefined && dtz !== null) {
            return `DTZ ${dtz}`;
          }
          return "";
        });

  return (
    <Group p="xs">
      <Badge 
        autoContrast 
        color={color} 
        style={{ 
          textTransform: "none", 
          flexShrink: 0, // هذه الخاصية تمنع الـ Badge من الانكماش
          minWidth: "max-content" // لضمان احتفاظه بعرضه الطبيعي
        }}
      >
        {label}
      </Badge>
      {["blessed-loss", "cursed-win", "maybe-win", "maybe-loss"].includes(category) && wins && (
        <Text c="dimmed" fz="xs">
          {t("Board.Analysis.Tablebase.FiftyMoveRule")}
        </Text>
      )}
    </Group>
  );
}
export default TablebaseInfo;
