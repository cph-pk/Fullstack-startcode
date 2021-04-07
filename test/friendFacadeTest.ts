import * as mongo from "mongodb"
import FriendFacade from '../src/facades/friendFacade';

import chai from "chai";
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import bcryptjs from "bcryptjs"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/apiError";

let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe("## Verify the Friends Facade ##", () => {

    before(async function () {
        //Connect to inmemory test database
        //Get the database and initialize the facade
        //Initialize friendCollection, to operate on the database without the facade
        const client = await InMemoryDbConnector.connect();
        const db = client.db();
        friendCollection = db.collection("friends");
        facade = new FriendFacade(db)
    })

    beforeEach(async () => {
        const hashedPW = await bcryptjs.hash("secret", 4)
        //Create a few few testusers for ALL the tests
        await friendCollection.deleteMany({})
        await friendCollection.insertMany([
            { firstName: "Pop", lastName: "Corn", email: "pc@b.dk", password: hashedPW, role: "user" },
            { firstName: "Pip", lastName: "Fugl", email: "pf@b.dk", password: hashedPW, role: "user" }
        ])
    })

    describe("Verify the addFriend method", () => {
        it("It should Add the user Jan", async () => {
            const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
            const status = await facade.addFriend(newFriend);
            expect(status).to.be.not.null
            const jan = await friendCollection.findOne({ email: "jan@b.dk" })
            expect(jan.firstName).to.be.equal("Jan")
        })

        it("It should not add a user with a role (validation fails)", async () => {
            const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret", role: "admin" }
            try {
                await facade.addFriend(newFriend);
                expect(false).to.be.true("Should never get here")
            } catch (err) {
                expect(err instanceof ApiError).to.be.true
            }
        })

        it("It should not add a user with a role (validation fails)", async () => {
            const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret", role: "admin" }
            await expect(facade.addFriend(newFriend)).to.be.rejectedWith(ApiError)
        })
    })

    describe("Verify the editFriend method", () => {
        it("It should change lastName to XXXX", async () => {
            const newLastName = { firstName: "Pop", lastName: "XXXX", email: "pc@b.dk", password: "secret" }
            const status = await facade.editFriend("pc@b.dk", newLastName);
            expect(status.modifiedCount).to.equal(1)
            const editedFriend = await friendCollection.findOne({ email: "pc@b.dk" })
            expect(editedFriend.lastName).to.be.equal("XXXX")
        })
    })

    describe("Verify the deleteFriend method", () => {
        xit("It should remove the user Peter", async () => {
        })
        xit("It should return false, for a user that does not exist", async () => {
        })
    })

    describe("Verify the getAllFriends method", () => {
        xit("It should get two friends", async () => {
        })
    })

    describe("Verify the getFriend method", () => {

        xit("It should find Donald Duck", async () => {
        })
        xit("It should not find xxx.@.b.dk", async () => {
        })
    })

    describe("Verify the getVerifiedUser method", () => {
        it("It should correctly validate Pop Corn's credential,s", async () => {
            const veriefiedPeter = await facade.getVerifiedUser("pc@b.dk", "secret")
            expect(veriefiedPeter).to.be.not.null;
        })

        xit("It should NOT validate Pop Corn's credential,s", async () => {
        })

        xit("It should NOT validate a non-existing users credentials", async () => {
        })
    })

})