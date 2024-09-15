import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

interface OperationCellProps {
  row: {
    getValue: (key: string) => any;
  };
}

const OperatorCell: React.FC<OperationCellProps> = ({row}) => {
  const [operators, setOperators] = useState<string[]>([]);
  const [operatorNames, setOperatorNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchOperationStatus = async () => {
      const satelliteScheduleId = row.getValue("id");
      console.log("satelliteScheduleId", satelliteScheduleId);
      const {data, error} = await supabase
        .from("operation")
        .select("status, operators")
        .eq("satellite_schedule_id", satelliteScheduleId as string)
        .single();

      console.log("data", data);

      if (error) {
        console.error("Error fetching operation status:", error);
      } else {
        if (data) {
          // operatorsのリストを取得
          if (Array.isArray(data.operators)) {
            // operatorsが配列かどうかを確認
            setOperators(data.operators as string[]);
          } else {
            setOperators([]);
          }
        } else {
          setOperators([]);
        }
      }
    };

    fetchOperationStatus();
  }, [row]);

  // operatorsのユーザー情報を取得
  useEffect(() => {
    const fetchOperatorNames = async () => {
      console.log("operators", operators);
      if (operators.length > 0) {
        const {data, error} = await supabase
          .from("user_details")
          .select("last_name")
          .in("auth_id", operators);

        if (error) {
          console.error("Error fetching operator names:", error);
        } else if (data) {
          const names = data.map((user) => user.last_name);
          setOperatorNames(names as string[]);
        }
      }
    };

    fetchOperatorNames();
  }, [operators]);

  return (
    <div>
      {operatorNames.length > 0 && (
        <div>
          <ul>
            {operatorNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OperatorCell;
