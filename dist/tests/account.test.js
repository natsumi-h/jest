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
describe("Account", () => {
    beforeEach(() => {
        jest_fetch_mock_1.default.resetMocks();
    });
    it("should fetch account successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const accountData = {
            attributes: {
                id: "1",
                user_id: 1,
                name: "Sample Account",
                balance: 1000,
            },
        };
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(accountData));
        const account = yield script_1.Account.fetchAccount(1);
        expect(account.id).toBe("1");
        expect(account.user_id).toBe(1);
        expect(account.name).toBe("Sample Account");
        expect(account.balance).toBe(1000);
    }));
    it("should handle fetch error", () => __awaiter(void 0, void 0, void 0, function* () {
        jest_fetch_mock_1.default.mockRejectOnce(new Error("Failed to fetch"));
        yield expect(script_1.Account.fetchAccount(1)).rejects.toThrow("Failed to fetch");
    }));
    it("should handle 404 error", () => __awaiter(void 0, void 0, void 0, function* () {
        jest_fetch_mock_1.default.mockResponseOnce("", { status: 404 });
        yield expect(script_1.Account.fetchAccount(1)).rejects.toThrow("Failed to fetch data: 404");
    }));
});
