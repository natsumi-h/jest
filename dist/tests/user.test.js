"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = require("../src/script");
const jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
describe("User", () => {
    beforeEach(() => {
        jest_fetch_mock_1.default.resetMocks();
    });
    it("should fetch user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            attributes: {
                id: 1,
                name: "Sample User",
                account_ids: [1, 2],
            },
        };
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(userData));
        const user = yield script_1.User.fetchUser(1);
        expect(user.id).toBe(1);
        expect(user.name).toBe("Sample User");
        expect(user.account_ids).toEqual([1, 2]);
    }));
    it("should handle fetch error", () => __awaiter(void 0, void 0, void 0, function* () {
        jest_fetch_mock_1.default.mockRejectOnce(new Error("Failed to fetch"));
        yield expect(script_1.User.fetchUser(1)).rejects.toThrow("Failed to fetch");
    }));
    it("should handle 404 error", () => __awaiter(void 0, void 0, void 0, function* () {
        jest_fetch_mock_1.default.mockResponseOnce("", { status: 404 });
        yield expect(script_1.User.fetchUser(1)).rejects.toThrow("Failed to fetch data: 404");
    }));
    it("should fetch user accounts successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            attributes: {
                id: 1,
                name: "Sample User",
                account_ids: [1, 2],
            },
        };
        const accountsData = [
            { attributes: { id: "1", user_id: 1, name: "Account 1", balance: 1000 } },
            { attributes: { id: "2", user_id: 1, name: "Account 2", balance: 2000 } },
        ];
        jest_fetch_mock_1.default.mockResponses([JSON.stringify(userData), { status: 200 }], [JSON.stringify(accountsData), { status: 200 }]);
        const user = yield script_1.User.fetchUser(1);
        yield user.fetchUserAccounts();
        expect(user.accounts.length).toBe(2);
        expect(user.accounts[0].id).toBe("1");
        expect(user.accounts[1].id).toBe("2");
    }));
    it("should handle error fetching user accounts", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            attributes: {
                id: 1,
                name: "Sample User",
                account_ids: [1, 2],
            },
        };
        jest_fetch_mock_1.default.mockResponses([JSON.stringify(userData), { status: 200 }], [JSON.stringify({}), { status: 500 }]);
        const user = yield script_1.User.fetchUser(1);
        yield expect(user.fetchUserAccounts()).rejects.toThrow("Failed to fetch data: 500");
    }));
});
