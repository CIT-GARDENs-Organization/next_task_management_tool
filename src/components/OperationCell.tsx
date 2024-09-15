import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

interface OperationCellProps {
  row: {
    getValue: (key: string) => any;
  };
}

const OperationCell: React.FC<OperationCellProps> = ({row}) => {
  const [operationStatus, setOperationStatus] = useState<string>("未設定");

  useEffect(() => {
    const fetchOperationStatus = async () => {
      const satelliteScheduleId = row.getValue("id");
      console.log("satelliteScheduleId", satelliteScheduleId);
      const {data, error} = await supabase
        .from("operation")
        .select("status")
        .eq("satellite_schedule_id", satelliteScheduleId as string)
        .single();

      if (error) {
        console.error("Error fetching operation status:", error);
        setOperationStatus("未設定");
      } else {
        if (data) {
          // ステータス値をチェックして対応するテキストを設定
          switch (data.status) {
            case "operate":
              setOperationStatus("運用あり");
              break;
            case "doNotOperate":
              setOperationStatus("運用しない");
              break;
            case "unset":
            default:
              setOperationStatus("未設定");
              break;
          }
        } else {
          setOperationStatus("未設定");
        }
      }
    };

    fetchOperationStatus();
  }, [row]);

  // バッジのバリアントを決定
  const badgeVariant =
    operationStatus === "運用あり"
      ? "default"
      : operationStatus === "運用しない"
      ? "secondary"
      : "destructive";

  return <Badge variant={badgeVariant}>{operationStatus}</Badge>;
};

export default OperationCell;
