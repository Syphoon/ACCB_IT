import React, { createContext, useEffect, useState } from "react";
export type TypeNotification = "ask" | "message" | "warning";

interface IAlert {
	openAlert: any,
	closeAlert: any,
	notification: {
		text: string,
		type: TypeNotification,
		icon: string,
	},
}
const AlertContext = createContext<IAlert>({
	openAlert: (type: TypeNotification, text: string) => { },
	closeAlert: () => { },
	notification: {
		text: "",
		type: "warning",
		icon: "string",
	},
});


export const AlertProvider: React.FC<IAlert> = ({ children }) => {
	const [notification, setNotification] = useState<any>({});

	const openAlert = (type: TypeNotification, text: string, icon?: string) => {
		setNotification({
			text: text,
			type: type,
			icon: icon || "",
		});
	};

	const closeAlert = () => {
		setNotification({
			text: "",
			icon: "string",
			type: "warning",
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
