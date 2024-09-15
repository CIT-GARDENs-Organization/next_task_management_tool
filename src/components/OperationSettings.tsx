import {useState} from "react";
import useSWR from "swr";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {createClient} from "@/utils/supabase/client"; // Supabase クライアントの作成

type OperationStatus = "unset" | "operate" | "doNotOperate";

interface OperationSettingsProps {
  onStatusChange: (status: OperationStatus) => void;
}

const supabase = createClient();

// ユーザーリストを取得するフェッチ関数
const fetcher = async () => {
  const {data, error} = await supabase.from("user_details").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const OperationSettings = ({onStatusChange}: OperationSettingsProps) => {
  const [operationStatus, setOperationStatus] =
    useState<OperationStatus>("unset");
  const [operators, setOperators] = useState<string[]>([]); // 運用者のIDリストを管理
  const [commands, setCommands] = useState<string[][]>([]); // コマンドリスト
  const [commandInput, setCommandInput] = useState<Array<string>>(
    new Array(11).fill("") // 11個の要素に変更
  );
  const {data: userDetails, error} = useSWR("user_details", fetcher); // SWRでユーザーリストを取得

  const handleStatusChange = (status: OperationStatus) => {
    setOperationStatus(status);
    onStatusChange(status);
  };

  const addOperator = (id: string) => {
    setOperators([...operators, id]);
  };

  const removeOperator = (index: number) => {
    setOperators(operators.filter((_, i) => i !== index));
  };

  const handleSelectUser = (id: string) => {
    if (id && !operators.includes(id)) {
      addOperator(id);
    }
  };

  const handleCommandInputChange = (index: number, value: string) => {
    const newCommandInput = [...commandInput];
    newCommandInput[index] = value.toUpperCase();
    setCommandInput(newCommandInput);
  };

  const handleAddCommand = () => {
    if (commandInput.every((c) => /^[0-9A-F]{2}$/.test(c))) {
      setCommands([...commands, commandInput]);
      setCommandInput(new Array(11).fill("")); // フォームをリセット
    } else {
      alert("すべてのフィールドに16進数の2桁の値を入力してください。");
    }
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  if (error) return <div>Error loading user details...</div>;
  if (!userDetails) return <div>Loading user details...</div>;

  return (
    <div>
      <div className="flex justify-center mt-8 space-x-8">
        <Button
          variant={operationStatus === "operate" ? "default" : "outline"}
          onClick={() =>
            handleStatusChange(
              operationStatus === "operate" ? "unset" : "operate"
            )
          }
        >
          運用する
        </Button>
        <Button
          variant={operationStatus === "doNotOperate" ? "default" : "outline"}
          onClick={() =>
            handleStatusChange(
              operationStatus === "doNotOperate" ? "unset" : "doNotOperate"
            )
          }
        >
          運用しない
        </Button>
      </div>
      <div className="mt-8">
        {operationStatus === "operate" && (
          <>
            <h3 className="text-lg font-bold">担当者アサイン</h3>
            <div className="mt-2">
              {/* ドロップダウンメニュー */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">運用者を選択</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>ユーザーを選択</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {userDetails.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        {user.last_name} {user.first_name} ({user.unit_no}号機)
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <ul>
                {operators.map((operatorId, index) => {
                  const user = userDetails.find(
                    (user) => user.id === operatorId
                  );
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center mt-2"
                    >
                      <span>
                        {user
                          ? `${user.last_name} ${user.first_name}`
                          : "Unknown User"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => removeOperator(index)}
                      >
                        削除
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Separator className="my-4" />
            <h3 className="text-lg font-bold">コマンド登録</h3>
            <div className="mt-2">
              <div className="flex space-x-2 mb-2">
                {commandInput.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleCommandInputChange(index, e.target.value)
                    }
                    placeholder="00"
                    maxLength={2}
                    className="border rounded px-2 py-1 w-12 text-center"
                  />
                ))}
              </div>
              <Button onClick={handleAddCommand} className="mt-2">
                コマンドを追加
              </Button>
              <ul className="mt-4">
                {commands.map((command, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mt-2"
                  >
                    <span>{command.join(" ")}</span>
                    <Button
                      variant="outline"
                      onClick={() => removeCommand(index)}
                    >
                      削除
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {operationStatus === "doNotOperate" && (
          <>
            <p>このパスは運用しない設定です。</p>
            <p>切り替えるにはボタンを押してください。</p>
          </>
        )}
        {operationStatus === "unset" && (
          <>
            <p>運用するかどうかを選択してください。</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OperationSettings;
