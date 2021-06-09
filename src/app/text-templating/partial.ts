import faker from "faker";

export const partial = (type: string) => {
    switch (type) {
        case "MEMBERSHIP": {
            const membership_value = faker.random.alphaNumeric(8).toUpperCase();
            return chop(membership_value, "membership");
        }
        case "PLATE": {
            const plate_value = faker.random.alphaNumeric(9).toUpperCase();
            return chop(plate_value, "plate_value");
        }
    }
}

export const chop = (info: string, name: string) => {
    const pos = faker.datatype.number({ min: 3, max: info.length - 3 });
    const reference = faker.random.arrayElement(["starts_with", "ends_with"]);

    if (reference == "starts_with") {
        return {
            name,
            info,
            reference: "starts with",
            chopped: info.toString().substring(0, pos),
            type: "text",
        };
    } else {
        return {
            name,
            info,
            reference: "ends with",
            chopped: info.toString().substring(pos),
            type: "text",
        };
    }
}