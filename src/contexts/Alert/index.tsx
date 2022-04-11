import React, { createContext, useEffect, useState } from "react";
export type TypeNotification = "ask" | "message" | "warning";

interface IAlert {
	openAlert?: any,
	closeAlert?: any,
	notification?: {
		text: string,
		type: TypeNotification,
		icon: string,
		onPress: any,
	},
}
const AlertContext = createContext<IAlert>({
	openAlert: (type: TypeNotification, text: string) => { },
	closeAlert: () => { },
	notification: {
		text: "",
		type: "warning",
		icon: "string",
		onPress: "",
	},
});


export const AlertProvider: React.FC<IAlert> = ({ children }) => {
	const [notification, setNotification] = useState<any>({});

	const openAlert = (type: TypeNotification, text: string, icon?: string, onPress?: any) => {
		setNotification({
			text: text,
			type: type,
			icon: icon || "",
			onPress: onPress || undefined,
		});
	};

	const closeAlert = () => {
		setNotification({
			text: "",
			icon: "string",
			type: "warning",
			onPress: undefined,
		});
	};

	return (
		<AlertContext.Provider
			value={{
				openAlert,
				closeAlert,
				notification
			}}>
			{children}
		</AlertContext.Provider>
	);
};

export default AlertContext;
