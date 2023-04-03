export type ImportedNcNode = {
    node_alias: string
    address: string
    pub_key: string
    domain?: string
    chains?: string[]
}

export type PrivateNcNode = {
    priv_key: string
} & ImportedNcNode
