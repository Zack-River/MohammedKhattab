import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
export async function listResources() {
  const { client } = await requireIdentity();
  const { data, error } = await client.from("resources").select("id,title,description,type");
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return data;
}
export async function readResource(id: string) {
  const { client } = await requireIdentity();
  const { data, error } = await client.from("resources").select("id,content").eq("id", id).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(404, "NOT_FOUND");
  return data;
}
