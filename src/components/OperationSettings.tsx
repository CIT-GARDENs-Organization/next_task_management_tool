import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

type OperationStatus = "unset" | "operate" | "doNotOperate";

interface OperationSettingsProps {
  onStatusChange: (status: OperationStatus) => void;
}

const OperationSettings = ({onStatusChange}: OperationSettingsProps) => {
  const [operationStatus, setOperationStatus] =
    useState<OperationStatus>("unset");

  const handleStatusChange = (status: OperationStatus) => {
    setOperationStatus(status);
    onStatusChange(status);
  };

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
            <p>ここに担当者アサイン画面の内容を表示します。</p>
            <Separator className="my-4" />
            <h3 className="text-lg font-bold">コマンド登録</h3>
            <p>ここにコマンド登録画面の内容を表示します。</p>
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
