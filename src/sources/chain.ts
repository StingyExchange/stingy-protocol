import { register } from "../register";

export interface ChainSnapshot {
  blockNumber: number;
  chainIdHex: string;
  gasPriceWei: bigint;
  baseFeeWei: bigint | null;
  gasUsed: number | null;
  gasLimit: number | null;
  blockTimestamp: number; // seconds since epoch
  fetchedAt: number; // ms since epoch, client clock
}

interface RpcRequest {
  method: string;
  params: unknown[];
}

async function rpcBatch(url: string, requests: RpcRequest[]): Promise<any[]> {
  const body = requests.map((r, i) => ({ jsonrpc: "2.0", id: i, method: r.method, params: r.params }));
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : [json];
  return arr
    .sort((a, b) => a.id - b.id)
    .map((entry) => {
      if (entry.error) throw new Error(`RPC error: ${entry.error.message ?? "unknown"}`);
      return entry.result;
    });
}

/** Fetches the latest chain snapshot. Returns null on any failure — callers show "—". */
export async function fetchChainSnapshot(): Promise<ChainSnapshot | null> {
  if (register.rpcUrl.state !== "stated" || !register.rpcUrl.value) return null;
  const url = register.rpcUrl.value;
  try {
    const [chainIdHex, gasPriceHex, blockNumberHex] = await rpcBatch(url, [
      { method: "eth_chainId", params: [] },
      { method: "eth_gasPrice", params: [] },
      { method: "eth_blockNumber", params: [] },
    ]);
    const [block] = await rpcBatch(url, [
      { method: "eth_getBlockByNumber", params: [blockNumberHex, false] },
    ]);
    if (!block) return null;

    return {
      blockNumber: Number(BigInt(blockNumberHex)),
      chainIdHex,
      gasPriceWei: BigInt(gasPriceHex),
      baseFeeWei: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
      gasUsed: block.gasUsed ? Number(BigInt(block.gasUsed)) : null,
      gasLimit: block.gasLimit ? Number(BigInt(block.gasLimit)) : null,
      blockTimestamp: Number(BigInt(block.timestamp)),
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}
