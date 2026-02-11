# from fastapi import APIRouter, Request
# from app.services.summary import create_patient_summary

# router = APIRouter(
#     prefix="/summary",
#     tags=["summary"]
# )

# from fastapi import APIRouter, Request, HTTPException
# from services.summary import create_patient_summary

# router = APIRouter()

# @router.post("/")
# async def summarize_transcript(request: Request):
#     try:
#         body = await request.json()

#         age = body.get("age")
#         gender = body.get("gender")
#         concerns = body.get("concerns")
#         conversation_context = body.get("conversation_context")

#         link, html_summary = create_patient_summary(
#             age=age,
#             gender=gender,
#             concerns=concerns,
#             conversation_context=conversation_context
#         )

#         return {
#             "summary_url": link,
#             "summary": html_summary
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))




