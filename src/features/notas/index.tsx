import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { useTheme } from "@/src/contexts/TemaContext";
import { NotaListSkeleton } from "@/components/ui/skeleton";
import { getStyles } from "./styles/notas.styles";
import { NotaItem } from "./components/notaItem";
import { EstadoVacio } from "./components/notasVacias";
import { useNotasScreen } from "./hooks/useNotasScreen";
import { NotasHeader } from "./components/headerNotas";
import { VistaInvitados } from "../calendario/components/VistaInvitado";

export default function NotasScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  const {
    notas, loading, refreshing, isGuest,
    handleRefresh, handleDelete, handleToggleCompleted, handleCrear,
  } = useNotasScreen();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NotasHeader
        paddingTop={insets.top + 8}
        styles={styles}
        colors={colors}
        isGuest={isGuest}
        onCrear={handleCrear}
      />

      {isGuest ? (
        <VistaInvitados colors={colors} />
      ) : loading && notas.length === 0 ? (
        <NotaListSkeleton count={4} />
      ) : (
        <FlashList
          data={notas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 0 }}
          renderItem={({ item }) => (
            <NotaItem
              item={item}
              onToggleCompleted={handleToggleCompleted}
              onDelete={handleDelete}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={<EstadoVacio colors={colors} />}
        />
      )}
    </View>
  );
}
