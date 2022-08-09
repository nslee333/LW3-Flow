import * as fcl from "@onflow/fcl";

export async function checkIsInitialized(addr) {
    return fcl.query({
        cadence: IS_INITIALIZED,
        args: (arg, t) => [arg(addr, t.Address)],
    });
}

const IS_INITIALIZED = `
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

pub fun main(account: Address): Bool {
    let capability = getAccount(account).getCapability<&Domains.Collection{NonFungible.CollectionPublic, Domains.CollectionPublic}>(Domains.DomainsPublicPath)
    return capability.check()
}
`;

export async function getAllDomainInfos() {
    return fcl.query({
        cadence: GET_ALL_DOMAIN_INFOS,
    });
}

const GET_ALL_DOMAIN_INFOS = `
import Domains from 0xDomains

pub fun main(): [Domains.DomainsInfo] {
    let allOwners = Domains.getAllOwners()
    let infos: [Domains.DomainsInfo] = []
    
    for nameHash in allOwners.keys {
        let publicCap = getAccount(allOwners[nameHash]!).getCapability<&Domains.Collection{Domains.CollectionPublic}>(Domains.DomainsPublicPath)
        let collection = publicCap.borrow()!
        let id = Domains.nameHashToIds[nameHash]
        if id != nil {
            let domain = collection.borrowDomain(id: id!)
            let domainInfo = domain.getInfo()
            infos.append(domainInfo)
        }
    }
    return infos
}
`;
