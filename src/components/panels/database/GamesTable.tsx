import { Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAtom, useSetAtom } from "jotai";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { memo, useEffect, useState } from "react";
import type { NormalizedGame } from "@/bindings";
import { activeTabAtom, tabsAtom } from "@/state/atoms";
import { createTab } from "@/utils/tabs";

function GamesTable({
  games,
  loading,
  databasePath,
}: {
  games: NormalizedGame[];
  loading: boolean;
  databasePath?: string | null;
}) {
  const [, setTabs] = useAtom(tabsAtom);
  const setActiveTab = useSetAtom(activeTabAtom);
  const [page, setPage] = useState(1);

  // حالة الترتيب الافتراضية
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<NormalizedGame>>({
    columnAccessor: "date",
    direction: "desc",
  });

  const [sortedGames, setSortedGames] = useState<NormalizedGame[]>([]);

  // منطق الترتيب
  useEffect(() => {
    let sorted = [...games];
    const { columnAccessor, direction } = sortStatus;

    if (columnAccessor) {
      sorted = sorted.sort((a, b) => {
        let aVal = a[columnAccessor as keyof NormalizedGame];
        let bVal = b[columnAccessor as keyof NormalizedGame];

        // معالجة خاصة لترتيب التواريخ
        if (columnAccessor === "date") {
          aVal = aVal ? dayjs(aVal as string).unix() : 0;
          bVal = bVal ? dayjs(bVal as string).unix() : 0;
        }

        if (aVal === bVal) return 0;
        if (aVal === undefined || aVal === null) return direction === "asc" ? -1 : 1;
        if (bVal === undefined || bVal === null) return direction === "asc" ? 1 : -1;

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setSortedGames(sorted);
  }, [games, sortStatus]);

  // تقسيم المباريات المرتبة إلى صفحات
  const filteredGames = sortedGames.slice((page - 1) * 20, page * 20);

  useEffect(() => {
    setPage(1);
  }, [games]);

  const navigate = useNavigate();
  return (
    <DataTable
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      withTableBorder
      highlightOnHover
      records={filteredGames}
      fetching={loading}
      totalRecords={games.length}
      recordsPerPage={20}
      page={page}
      onPageChange={setPage}
      onRowClick={(e) => {
        const game = e.record;
        createTab({
          tab: {
            name: `${game.white} - ${game.black}`,
            type: "analysis",
          },
          setTabs,
          setActiveTab,
          pgn: game.moves,
          headers: game,
          gameOrigin: databasePath
            ? {
                kind: "database",
                database: databasePath,
                gameId: game.id,
              }
            : undefined,
        });
        navigate({ to: "/" });
      }}
      columns={[
        {
          accessor: "white",
          sortable: true,
          render: ({ white, white_elo }) => (
            <div>
              <Text size="sm" fw={500}>
                {white}
              </Text>
              <Text size="xs" c="dimmed">
                {white_elo === 0 ? "Unrated" : white_elo}
              </Text>
            </div>
          ),
        },
        {
          accessor: "black",
          sortable: true,
          render: ({ black, black_elo }) => (
            <div>
              <Text size="sm" fw={500}>
                {black}
              </Text>
              <Text size="xs" c="dimmed">
                {black_elo === 0 ? "Unrated" : black_elo}
              </Text>
            </div>
          ),
        },
        { accessor: "date", sortable: true },
        { accessor: "result", sortable: true },
        { accessor: "ply_count", sortable: true },
      ]}
      noRecordsText="No games found"
    />
  );
}

export default memo(GamesTable);